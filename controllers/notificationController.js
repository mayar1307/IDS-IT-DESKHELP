const db = require("../config/db");

async function getMyNotifications(req, res) {
  try {
    const userId = req.user.userId;

    const [notifications] = await db.query(
      `
      SELECT
        NotificationId,
        Message,
        IsRead,
        CreatedAt,
        UserId
      FROM Notification
      WHERE UserId = ?
      ORDER BY CreatedAt DESC
      `,
      [userId]
    );

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message
    });
  }
}

async function createNotification(req, res) {
  try {
    const { message, userId } = req.body;

    if (!message || !userId) {
      return res.status(400).json({
        message: "message and userId are required."
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO Notification
      (Message, IsRead, CreatedAt, UserId)
      VALUES (?, false, NOW(), ?)
      `,
      [message, userId]
    );

    res.status(201).json({
      message: "Notification created successfully",
      notificationId: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create notification",
      error: error.message
    });
  }
}

async function markNotificationAsRead(req, res) {
  try {
    const notificationId = req.params.id;
    const userId = req.user.userId;

    await db.query(
      `
      UPDATE Notification
      SET IsRead = true
      WHERE NotificationId = ? AND UserId = ?
      `,
      [notificationId, userId]
    );

    res.json({
      message: "Notification marked as read"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update notification",
      error: error.message
    });
  }
}

module.exports = {
  getMyNotifications,
  createNotification,
  markNotificationAsRead
};