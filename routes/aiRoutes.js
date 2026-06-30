const express = require("express");

const {
  askChatbot,
  analyzeTicket
} = require("../controllers/aiController");

const {
  verifyToken
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/chat", verifyToken, askChatbot);
router.post("/analyze-ticket", verifyToken, analyzeTicket);

module.exports = router;