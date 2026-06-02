const express = require("express");
const {
  register,
  login,
  forgotPassword
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

router.get("/test", (req, res) => {
  res.json({ message: "Auth routes working" });
});

module.exports = router;