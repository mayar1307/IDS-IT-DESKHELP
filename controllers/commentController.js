const db = require("../config/db");
const logActivity = require("../utils/activityLogger");

async function getCommentsByTicket(req, res) {
  try {
    const ticketId = req.params.ticketId;

    const [comments] = await db.query(
      `
      SELECT
        TicketComment.CommentId,
        TicketComment.Message,
        TicketComment.CreatedAt,
        TicketComment.TicketId,
        User.UserId,
        User.Name AS UserName,
        User.Email AS UserEmail
      FROM TicketComment
      JOIN User ON TicketComment.UserId = User.UserId
      WHERE TicketComment.TicketId = ?
      ORDER BY TicketComment.CreatedAt ASC
      `,
      [ticketId]
    );

    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message
    });
  }
}

async function createComment(req, res) {
  try {
    const { ticketId, message } = req.body;
    const userId = req.user.userId;

    if (!ticketId || !message) {
      return res.status(400).json({
        message: "ticketId and message are required."
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO TicketComment
      (CreatedAt, Message, TicketId, UserId)
      VALUES (NOW(), ?, ?, ?)
      `,
      [message, ticketId, userId]
    );

    await logActivity({
      action: "CREATE_COMMENT",
      entityId: result.insertId,
      entityType: "TicketComment",
      userId
    });

    res.status(201).json({
      message: "Comment added successfully",
      commentId: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add comment",
      error: error.message
    });
  }
}

module.exports = {
  getCommentsByTicket,
  createComment
};