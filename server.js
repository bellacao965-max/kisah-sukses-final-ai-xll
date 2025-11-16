import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === AI CONFIG ===
if (!process.env.GROQ_API_KEY) {
  console.error("❌ ERROR: GROQ_API_KEY belum di-set!");
}

const MODEL = process.env.MODEL || "llama-3.1-8b-instant";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// === ROUTE AI ===
app.post("/api/ai", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    if (!prompt) return res.status(400).json({ error: "No prompt provided" });

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400
    });

    const reply = completion.choices?.[0]?.message?.content || "";
    res.json({ reply });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "AI Error", detail: err.message });
  }
});

// === STATIC FILES ===
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// === START SERVER ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Server RUNNING on port " + PORT));
