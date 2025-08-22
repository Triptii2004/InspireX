
console.log("🚀 server.js file started loading...");
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// FIXED #1: Consistently check for OPENAI_API_KEY
if (!process.env.GOOGLE_API_KEY) {
  // FIXED #2: Corrected the error message to be consistent
  console.error("❌ GOOGLE_API_KEY not found. Check your .env file!");
  process.exit(1); // Added exit to stop the server if key is missing
} else {
  // FIXED #2: Corrected the success message
  console.log("✅ API Key loaded successfully");
}

// FIXED #1: Consistently use OPENAI_API_KEY to initialize the client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const app = express(); 
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from InspireX (Powered by Google Gemini!)',
    })
});

app.post('/', async (req, res) => {
    // FIXED #3: Corrected the try...catch structure
    try {
        const prompt = req.body.prompt;
        
        // Use the Gemini model to generate content
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Send the response back in the same format as before
        res.status(200).send({
            bot: text
        });
    } catch(error) {
       console.error("❌ Error in Google Gemini request:", error);
       res.status(500).send({ error: "Failed to get response from Gemini API." });
    }
});

app.listen(5000, () => {
  console.log("✅ Listening on http://localhost:5000");
});