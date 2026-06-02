const db = require("../config/db");

async function logActivity({ action, entityId, entityType, userId }) {
  try {
    await db.query(
      `
      INSERT INTO ActivityLog
      (Action, EntityId, EntityType, TimeStamp, UserId)
      VALUES (?, ?, ?, NOW(), ?)
      `,
      [action, entityId || null, entityType, userId || null]
    );
  } catch (error) {
    console.error("Activity log failed:", error.message);
  }
}

module.exports = logActivity;