const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function test() {
    try {
        console.log('Testing Gemini service with gemini-2.0-flash...');
        const result = await model.generateContent('Hello');
        const response = await result.response;
        console.log(`Success! Response: ${response.text()}`);
    } catch (error) {
        console.error('Test Failed!');
        console.error(error);
    }
}

test();
