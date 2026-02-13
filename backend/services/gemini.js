const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", // Using 2.5-flash as requested by user
    systemInstruction: {
        role: "system",
        parts: [{
            text: `
You are Nutri AI, a friendly and knowledgeable diet and fitness coach.
Your goal is to help users improve their health through personalized advice.

When talking to a user, follow these guidelines:
1.  **Be Encouraging:** Adopt a positive, motivating tone.
2.  **Gather Information:** If you don't have enough info (age, height, weight, activity level, dietary preferences, goals), ask for it politely. Do not ask for everything at once; make it conversational.
3.  **Provide Value:** Offer actionable tips, recipe ideas, or workout suggestions based on their responses.
4.  **Estimate Calories:** If asked, use standard formulas (like Mifflin-St Jeor) to estimate calorie needs, explaining that these are estimates.
5.  **Safety First:** Always remind users to consult with a healthcare professional before making drastic changes. 
6.  **Data Extraction:** If the user provides new personal information (age, height, weight, gender, activity level, goals, dietary preferences), you MUST output a JSON object at the very end of your response in a code block labeled \`json\`. 
    - The JSON should strictly follow this structure: { "age": number, "height": number, "weight": number, "gender": string, "activityLevel": string, "goals": string[], "dietaryPreferences": string[] }.
    - Only include fields that were mentioned or updated in the current turn.
    - Do not include this JSON block if no new info is provided.

Format your responses in clean Markdown.
`
        }],
    },
});

async function generateResponse(message, history = [], userContext = {}) {
    try {
        const chat = model.startChat({
            history: history.map(h => ({
                role: h.role === "assistant" ? "model" : "user",
                parts: [{ text: h.content }],
            })),
        });

        // Add user context
        let userMsg = message;
        if (userContext && Object.keys(userContext).length > 0) {
            userMsg += `\n\n(Context: ${JSON.stringify(userContext)})`;
        }

        const result = await chat.sendMessage(userMsg);
        return result.response.text();
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        throw error;
    }
}

module.exports = { generateResponse };
