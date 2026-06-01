const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Comment routes working" });
});

module.exports = router;