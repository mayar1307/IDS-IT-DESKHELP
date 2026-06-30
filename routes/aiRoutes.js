const express = require("express");

const {
  askChatbot
} = require("../controllers/aiController");

const {
  verifyToken
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/chat", verifyToken, askChatbot);

module.exports = router;