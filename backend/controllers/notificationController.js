const db = require("../db");

// --- Get all notifications for the logged-in user ---
const getUserNotifications = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json({ notifications: rows });
  } catch (err) {
    console.error("Fetch notifications error:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// --- Mark a notification as read ---
const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("UPDATE notifications SET is_read = 1 WHERE id = ?", [id]);
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Mark notification error:", err);
    res.status(500).json({ error: "Failed to update notification" });
  }
};

// --- Delete a notification ---
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM notifications WHERE id = ?", [id]);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error("Delete notification error:", err);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

// --- Create a notification ---
const createNotification = async (req, res) => {
  try {
    console.log("Incoming notification payload:", req.body);

    const { user_id, message } = req.body;

    if (!user_id || !message) {
      return res
        .status(400)
        .json({ error: "user_id and message are required" });
    }

    const ADMIN_ID = 1; // Change this if your admin id is not 1

    // 1️⃣ Save notification for the target user
    const [result] = await db.execute(
      "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
      [user_id, message]
    );

    // 2️⃣ Save a **copy** for the admin
    await db.execute(
      "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
      [
        ADMIN_ID,
        `Sent to user ${user_id}: ${message}`
      ]
    );

    const [newNotification] = await db.execute(
      "SELECT * FROM notifications WHERE id = ?",
      [result.insertId]
    );

    console.log("Notification created:", newNotification[0]);

    res.status(201).json({
      message: "Notification delivered, admin copy saved",
      notification: newNotification[0],
    });

  } catch (err) {
    console.error("Create notification error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = {
  getUserNotifications,
  markNotificationRead,
  deleteNotification,
  createNotification,
};