const express = require("express");

const {
  getCommentsByTicket,
  createComment
} = require("../controllers/commentController");

const {
  verifyToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/ticket/:ticketId",
  verifyToken,
  authorizeRoles("Admin", "Employee", "IT Support Agent", "Manager"),
  getCommentsByTicket
);

router.post(
  "/",
  verifyToken,
  authorizeRoles("Admin", "Employee", "IT Support Agent", "Manager"),
  createComment
);

router.get("/test", (req, res) => {
  res.json({ message: "Comment routes working" });
});

module.exports = router;