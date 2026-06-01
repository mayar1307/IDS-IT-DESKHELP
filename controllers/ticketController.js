const db = require("../config/db");
const logActivity = require("../utils/activityLogger");

async function getTickets(req, res) {
  try {
    const [tickets] = await db.query(`
      SELECT
        Ticket.TicketId,
        Ticket.Title,
        Ticket.Description,
        Ticket.CreatedAt,
        Ticket.UpdatedAt,
        Category.Name AS Category,
        Priority.Name AS Priority,
        Status.Name AS Status
      FROM Ticket
      LEFT JOIN Category ON Ticket.CategoryId = Category.CategoryId
      LEFT JOIN Priority ON Ticket.PriorityId = Priority.PriorityId
      LEFT JOIN Status ON Ticket.StatusId = Status.StatusId
    `);

    res.json(tickets);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tickets",
      error: error.message
    });
  }
}

async function createTicket(req, res) {
  try {
    const {
      title,
      description,
      categoryId,
      priorityId,
      createdBy,
      assignedTo,
      statusId
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO Ticket
      (
        Title,
        Description,
        CreatedAt,
        UpdatedAt,
        CategoryId,
        PriorityId,
        CreatedBy,
        AssignedTo,
        StatusId
      )
      VALUES (?, ?, NOW(), NOW(), ?, ?, ?, ?, ?)
      `,
      [
        title,
        description,
        categoryId,
        priorityId,
        createdBy,
        assignedTo,
        statusId
      ]
    );
    
    await logActivity({
      action: "CREATE_TICKET",
      entityId: result.insertId,
      entityType: "Ticket",
      userId: req.user.userId
    });

    res.status(201).json({
      message: "Ticket created successfully",
      ticketId: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create ticket",
      error: error.message
    });
  }
}

async function updateTicket(req, res) {
  try {
    const ticketId = req.params.id;
    const changedBy = req.user.userId;

    const {
      title,
      description,
      categoryId,
      priorityId,
      assignedTo,
      statusId
    } = req.body;

    const [oldTicketRows] = await db.query(
      "SELECT StatusId FROM Ticket WHERE TicketId = ?",
      [ticketId]
    );

    if (oldTicketRows.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const oldStatusId = oldTicketRows[0].StatusId;

    await db.query(
      `
      UPDATE Ticket
      SET
        Title = ?,
        Description = ?,
        CategoryId = ?,
        PriorityId = ?,
        AssignedTo = ?,
        StatusId = ?,
        UpdatedAt = NOW()
      WHERE TicketId = ?
      `,
      [
        title,
        description,
        categoryId,
        priorityId,
        assignedTo,
        statusId,
        ticketId
      ]
    );

    if (oldStatusId !== statusId) {
      await db.query(
        `
        INSERT INTO TicketHistory
        (ChangedAt, TicketId, ChangedBy, OldStatusId, NewStatusId)
        VALUES (NOW(), ?, ?, ?, ?)
        `,
        [ticketId, changedBy, oldStatusId, statusId]
      );
    }

    await logActivity({
      action: "UPDATE_TICKET",
      entityId: ticketId,
      entityType: "Ticket",
      userId: changedBy
    });

    res.json({
      message: "Ticket updated successfully",
      oldStatusId,
      newStatusId: statusId
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update ticket",
      error: error.message
    });
  }
}

async function deleteTicket(req, res) {
  try {
    const ticketId = req.params.id;

    await db.query(
      "DELETE FROM Ticket WHERE TicketId = ?",
      [ticketId]
    );

    await logActivity({
      action: "DELETE_TICKET",
      entityId: ticketId,
      entityType: "Ticket",
      userId: req.user.userId
    });

    res.json({
      message: "Ticket deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete ticket",
      error: error.message
    });
  }
}

module.exports = {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket
};

