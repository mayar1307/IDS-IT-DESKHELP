const db = require("../config/db");

async function getAttachmentsByTicket(req, res) {
  try {
    const ticketId = req.params.ticketId;

    const [attachments] = await db.query(
      `
      SELECT *
      FROM TicketAttachment
      WHERE TicketId = ?
      ORDER BY UploadedAt DESC
      `,
      [ticketId]
    );

    res.json(attachments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch attachments",
      error: error.message
    });
  }
}

async function createAttachment(req, res) {
  try {
    const { filePath, ticketId } = req.body;

    const uploadedBy = req.user.userId;

    const [result] = await db.query(
      `
      INSERT INTO TicketAttachment
      (UploadedAt, FilePath, TicketId, UploadedBy)
      VALUES (NOW(), ?, ?, ?)
      `,
      [filePath, ticketId, uploadedBy]
    );

    res.status(201).json({
      message: "Attachment added successfully",
      attachmentId: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add attachment",
      error: error.message
    });
  }
}

async function deleteAttachment(req, res) {
  try {
    const attachmentId = req.params.id;

    await db.query(
      `
      DELETE FROM TicketAttachment
      WHERE AttachmentId = ?
      `,
      [attachmentId]
    );

    res.json({
      message: "Attachment deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete attachment",
      error: error.message
    });
  }
}

module.exports = {
  getAttachmentsByTicket,
  createAttachment,
  deleteAttachment
};