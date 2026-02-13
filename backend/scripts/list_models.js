const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    console.log(`Checking models for key: ${key ? key.substring(0, 5) + '...' : 'undefined'}`);

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`Status: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error('Data:', text);
            return;
        }

        const data = await response.json();
        console.log('Available Models:');
        if (data.models) {
            data.models.forEach(m => {
                if (m.name.includes('flash')) {
                    console.log(m.name);
                }
            });
        } else {
            console.log('No models found in response.');
        }

    } catch (error) {
        console.error('List Models Failed!');
        console.error(error);
    }
}

listModels();
