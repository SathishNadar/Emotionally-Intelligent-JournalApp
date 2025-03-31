import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";


const app = express();
app.use(express.json());
app.use(cors());

app.post("/chat", async (req, res) => {
  const userQuery = req.body.query;
  
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
      {
        prompt: { text: userQuery },
      },
      {
        headers: { Authorization: `Bearer ${process.env.GEMINI_API_KEY}` },
      }
    );

    res.json({ response: response.data.candidates[0].content });
  } catch (error) {
    res.status(500).json({ error: "Error generating response" });
  }
});

export default app;