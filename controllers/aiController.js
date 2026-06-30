const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function askChatbot(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message is required."
      });
    }

    const prompt = `
You are an AI assistant for an IT Help Desk System.

Answer clearly and shortly.

Include:
- Category: Hardware, Software, Network, Email, Access Request, or Other
- Priority: Low, Medium, High, or Critical
- Suggested steps
- Whether the user should create a ticket

User issue:
${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    });

    res.json({
      reply: response.text
    });
  } catch (error) {
    res.status(500).json({
      message: "AI assistant failed.",
      error: error.message
    });
  }
}

async function analyzeTicket(req, res) {
  try {
    const { title, description } = req.body;

    if (!description) {
      return res.status(400).json({
        message: "Description is required."
      });
    }

    const prompt = `
Analyze this IT help desk ticket.

Return ONLY valid JSON. No markdown. No explanation.

Allowed categories:
Hardware, Software, Network, Email, Access Request, Other

Allowed priorities:
Low, Medium, High, Critical

Return this format:
{
  "title": "short improved title",
  "category": "one category",
  "priority": "one priority",
  "summary": "short summary"
}

Ticket title:
${title || "No title"}

Ticket description:
${description}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    });

    let text = response.text.trim();

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const analysis = JSON.parse(text);

    res.json(analysis);
  } catch (error) {
    res.status(500).json({
      message: "AI ticket analysis failed.",
      error: error.message
    });
  }
}

module.exports = {
  askChatbot,
  analyzeTicket
};