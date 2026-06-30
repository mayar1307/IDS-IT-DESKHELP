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
You are the AI assistant of an IT Help Desk System.

Rules:

1. Help employees solve IT problems.
2. If possible, explain the solution.
3. Suggest ONE category:
- Hardware
- Software
- Network
- Email
- Access Request
- Other

4. Suggest ONE priority:
- Low
- Medium
- High
- Critical

5. If the issue needs human intervention, recommend creating a ticket.

User Problem:

${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    res.json({
      reply: response.text
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Gemini failed.",
      error: error.message
    });

  }
}

module.exports = {
  askChatbot
};