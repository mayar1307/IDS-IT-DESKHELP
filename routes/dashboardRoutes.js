const express = require("express");

const {
  getStats
} = require("../controllers/dashboardController");

const {
  verifyToken
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/stats",
  verifyToken,
  getStats
);

router.get("/test", (req, res) => {
  res.json({
    message: "Dashboard routes working"
  });
});

module.exports = router;