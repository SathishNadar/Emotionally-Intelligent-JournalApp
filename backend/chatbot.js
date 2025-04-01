import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/chat", async (req, res) => {
  const userQuery = req.body.query.toLowerCase();

  let systemInstruction = "You are a friendly and engaging chatbot. Have casual conversations with the user, ask questions, and interact naturally.";

  // Check if the user is requesting tone adjustments
  if (userQuery.includes("proofread this") || userQuery.includes("make it") && 
      (userQuery.includes("friendly") || userQuery.includes("concise") || userQuery.includes("professional"))) {
    systemInstruction = "You are an AI chatbot specialized in proofreading text. Your task is to correct the tone of the given input text to be Friendly, Professional, or Concise.";
  }

  try {
    const model = ai.models;
    const responseStream = await model.generateContentStream({
      model: "gemini-2.0-flash",
      contents: userQuery,
      config: { systemInstruction },
    });

    let responseText = "";
    for await (const chunk of responseStream) {
      responseText += chunk.text;
    }

    res.json({ response: responseText });
  } catch (error) {
    console.error("Error calling Gemini API:", error.message);
    res.status(500).json({ error: "Error generating response" });
  }
});

export default app;