const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
    userId: { type: String, unique: true }, // Could be a simple generated ID for this demo
    name: String,
    age: Number,
    height: Number, // in cm
    weight: Number, // in kg
    gender: String,
    activityLevel: String, // e.g., sedentary, lightly active, etc.
    goals: [String], // e.g., weight loss, muscle gain
    dietaryPreferences: [String], // e.g., vegan, keto
    bmr: Number,
    tdee: Number,
    calorieTarget: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);
