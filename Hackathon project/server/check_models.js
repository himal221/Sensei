const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function checkModels() {
    try {
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        console.log("AVAILABLE MODELS:");
        response.data.models.forEach(m => {
            if (m.supportedGenerationMethods.includes('generateContent')) {
                console.log(`- ${m.name.replace('models/', '')}`);
            }
        });
    } catch (error) {
        console.error("Error listing models:", error.response?.data?.error?.message || error.message);
    }
}

checkModels();
