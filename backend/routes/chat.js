const express = require('express');
const router = express.Router();
const { generateResponse } = require('../services/gemini');
const UserProfile = require('../models/UserProfile');
const Message = require('../models/Message');
const { calculateBMR, calculateTDEE, calculateTarget } = require('../utils/calculations');

router.post('/', async (req, res) => {
    try {
        console.log('Received Chat Request:', req.body);
        const { message, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'UserId is required' });
        }

        // Save User Message
        const userMsg = new Message({ userId, role: 'user', content: message });
        await userMsg.save();

        // Fetch User Context
        let userContext = {};
        const userProfile = await UserProfile.findOne({ userId });
        if (userProfile) {
            userContext = userProfile;
        }

        // Fetch Recent Chat History (limit 20)
        // Sort effectively: newest first for limit, then reverse for chronological order
        const historyDocs = await Message.find({ userId })
            .sort({ timestamp: -1 })
            .limit(20);

        // Exclude current message from history passed to AI (since it's the prompt)
        const history = historyDocs
            .filter(msg => msg._id.toString() !== userMsg._id.toString())
            .sort((a, b) => a.timestamp - b.timestamp) // Oldest first
            .map(msg => ({ role: msg.role, content: msg.content }));

        let responseText = await generateResponse(message, history, userContext);

        // Extract JSON data if present
        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
            try {
                const extractedData = JSON.parse(jsonMatch[1]);
                console.log('Extracted User Data:', extractedData);

                // Update specific fields first
                let userProfile = await UserProfile.findOneAndUpdate(
                    { userId },
                    { $set: extractedData },
                    { new: true, upsert: true }
                );

                // Calculate Metrics
                if (userProfile.weight && userProfile.height && userProfile.age && userProfile.gender) {
                    const bmr = calculateBMR(userProfile.weight, userProfile.height, userProfile.age, userProfile.gender);
                    const tdee = calculateTDEE(bmr, userProfile.activityLevel);
                    const target = calculateTarget(tdee, userProfile.goals);

                    // Save calculated metrics
                    userProfile.bmr = bmr;
                    userProfile.tdee = tdee;
                    userProfile.calorieTarget = target;
                    await userProfile.save();
                    console.log('Calculated Metrics:', { bmr, tdee, target });
                }

                // Remove JSON block from response text
                responseText = responseText.replace(/```json\s*[\s\S]*?\s*```/, '').trim();
            } catch (e) {
                console.error('Failed to parse extracted JSON:', e);
            }
        }

        // Save Assistant Message
        const botMsg = new Message({ userId, role: 'assistant', content: responseText });
        await botMsg.save();

        res.json({ response: responseText });
    } catch (error) {
        console.error('Error in chat route:', error);
        res.status(500).json({ error: 'Failed to generate response', details: error.message, stack: error.stack });
    }
});

module.exports = router;
