const db = require("../config/db");

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

    const {
      title,
      description,
      categoryId,
      priorityId,
      assignedTo,
      statusId
    } = req.body;

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

    res.json({
      message: "Ticket updated successfully"
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

