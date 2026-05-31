const express = require("express");
const {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket
} = require("../controllers/ticketController");

const router = express.Router();

router.get("/", getTickets);
router.post("/", createTicket);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

router.get("/test/status", (req, res) => {
  res.json({ message: "Ticket routes working" });
});

module.exports = router;