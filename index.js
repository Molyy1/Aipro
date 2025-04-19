const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Allow CORS
app.use(cors());

// AI Endpoint
app.get("/aibot", async (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: "Missing 'prompt' parameter" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No reply received.";

    res.json({ success: true, response: reply });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ success: false, error: "Failed to get AI response" });
  }
});

// Root welcome
app.get("/", (req, res) => {
  res.send("AI Endpoint is working. Use /aibot?prompt=your_message");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});