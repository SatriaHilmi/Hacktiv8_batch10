// Import the Google Genai dependency
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();

// console.log(process.env);

//tambahkan middleware
app.use(cors());
app.use(express.json());

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

//tambahkan route untuk menerima request
app.post('/chat', async (req, res) => {
    // guard clause
    if (!req.body) {
        return res.status(400).send('No content provided');
    }

    const { prompt } = req.body;

    // guard clause for missing prompt
    if (!prompt) {
        return res.status(400).send('Prompt is required');
    }

    try {
        const aiResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return res.status(200).send(aiResponse.text);
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

//membuat server
app.listen("3000", () => {
    console.log('Server is running on http://localhost:3000');
});

// async function main() {
//     const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: "Explain how AI works in a few words",
//     });
//     console.log(response.text);

//     // console.log(response)
// }

// main();