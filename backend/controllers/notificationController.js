const db = require("../config/db");

// Get all notifications for the logged-in user
const getUserNotifications = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json({ notifications: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// Mark a notification as read
const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("UPDATE notifications SET is_read = 1 WHERE id = ?", [id]);
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update notification" });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM notifications WHERE id = ?", [id]);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

// Create a notification
const createNotification = async ({ user_id, message }) => {
  const [result] = await db.execute(
    "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
    [user_id, message]
  );
  const [newNotification] = await db.execute(
    "SELECT * FROM notifications WHERE id = ?",
    [result.insertId]
  );
  return newNotification[0];
};

module.exports = {
  getUserNotifications,
  markNotificationRead,
  deleteNotification,
  createNotification,
};
