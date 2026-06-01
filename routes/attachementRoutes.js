const express = require("express");

const {
  getAttachmentsByTicket,
  createAttachment,
  deleteAttachment
} = require("../controllers/attachmentController");

const {
  verifyToken
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:ticketId", verifyToken, getAttachmentsByTicket);

router.post("/", verifyToken, createAttachment);

router.delete("/:id", verifyToken, deleteAttachment);

router.get("/test/status", (req, res) => {
  res.json({
    message: "Attachment routes working"
  });
});

module.exports = router;