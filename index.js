// Import the Google Genai dependency
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import express, { text } from "express";
import cors from "cors";
import multer from "multer";

const app = express();

// console.log(process.env);

//tambahkan middleware
app.use(cors());
app.use(express.json());

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});
const { PORT } = process.env;

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

const upload = multer();

function imageToGenerativePart(file) {
    if (!file || !file.buffer) return null;
    return {
        inlineData: {
            data: file.buffer.toString('base64'),
            mimeType: file.mimetype,
        }
    };
}

app.post('/generate-image', upload.single('image'), async (req, res) => {

    if (!req.file) {
        return res.status(400).send('No image file provided');
    }

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).send('Prompt is required');
    }

    const image = imageToGenerativePart(req.file);

    if (!image) {
        return res.status(400).send('Invalid image file');
    }

    try {
        const aiResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                image,
                { text: prompt }
            ],
        });
        return res.status(200).send(aiResponse.text);
    } catch (e) {
        return res.status(500).send(e.message);
    }

});

app.post('/generate-from-document', upload.single('document'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No document file provided');
    }

    // const { prompt } = req.body;

    // if (!prompt) {
    //     return res.status(400).send('Prompt is required');
    // }

    const document = {
        inlineData: {
            data: req.file.buffer.toString('base64'),
            mimeType: req.file.mimetype,
        }
    };

    try {
        const aiResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                document,
                // { text: prompt }
            ],
        });
        return res.status(200).send(aiResponse.text);
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No audio file provided');
    }

    // const { prompt } = req.body;
    // const userPrompt = prompt && prompt.trim() ? prompt : "Generate content from this audio";

    const audio = {
        inlineData: {
            data: req.file.buffer.toString('base64'),
            mimeType: req.file.mimetype,
        }
    };

    try {
        const aiResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: audio,
            // contents: [
            //     audio,
            //     { text: userPrompt }
            // ],
        });
        // return res.status(200).json({
        //     prompt: userPrompt,
        //     result: aiResponse.text
        // });
        return res.status(200).send(aiResponse.text);
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

//membuat server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
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