const db = require("../config/db");

async function getStats(req, res) {
  try {
    const [[totalTickets]] = await db.query(
      "SELECT COUNT(*) AS count FROM Ticket"
    );

    const [[openTickets]] = await db.query(
      "SELECT COUNT(*) AS count FROM Ticket WHERE StatusId = 1"
    );

    const [[inProgressTickets]] = await db.query(
      "SELECT COUNT(*) AS count FROM Ticket WHERE StatusId = 2"
    );

    const [[pendingTickets]] = await db.query(
      "SELECT COUNT(*) AS count FROM Ticket WHERE StatusId = 3"
    );

    const [[resolvedTickets]] = await db.query(
      "SELECT COUNT(*) AS count FROM Ticket WHERE StatusId = 4"
    );

    const [[closedTickets]] = await db.query(
      "SELECT COUNT(*) AS count FROM Ticket WHERE StatusId = 5"
    );

    const [[totalUsers]] = await db.query(
      "SELECT COUNT(*) AS count FROM User"
    );

    res.json({
      totalTickets: totalTickets.count,
      openTickets: openTickets.count,
      inProgressTickets: inProgressTickets.count,
      pendingTickets: pendingTickets.count,
      resolvedTickets: resolvedTickets.count,
      closedTickets: closedTickets.count,
      totalUsers: totalUsers.count
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: error.message
    });
  }
}

module.exports = {
  getStats
};