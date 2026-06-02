const express = require("express");

const {
  getMyNotifications,
  createNotification,
  markNotificationAsRead
} = require("../controllers/notificationController");

const {
  verifyToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/my",
  verifyToken,
  getMyNotifications
);

router.post(
  "/",
  verifyToken,
  authorizeRoles("Admin", "IT Support Agent"),
  createNotification
);

router.put(
  "/:id/read",
  verifyToken,
  markNotificationAsRead
);

router.get("/test", (req, res) => {
  res.json({ message: "Notification routes working" });
});

module.exports = router;