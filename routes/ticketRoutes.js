const express = require("express");

const {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket
} = require("../controllers/ticketController");

const {
  verifyToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  verifyToken,
  authorizeRoles("Admin", "Employee", "IT Support Agent", "Manager"),
  getTickets
);

router.post(
  "/",
  verifyToken,
  authorizeRoles("Admin", "Employee", "Manager"),
  createTicket
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Admin", "IT Support Agent"),
  updateTicket
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  deleteTicket
);

router.get("/test/status", (req, res) => {
  res.json({ message: "Ticket routes working" });
});

module.exports = router;