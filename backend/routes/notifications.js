const express = require("express");
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
  markNotificationRead,
  deleteNotification,
} = require("../controllers/notificationController");
const { authMiddleware } = require("../middleware/authMiddleware");

// --- CREATE NOTIFICATION ---
router.post("/", authMiddleware, createNotification);

// --- GET logged-in user notifications ---
router.get("/", authMiddleware, getUserNotifications);

// --- MARK notification as read ---
router.patch("/:id/read", authMiddleware, markNotificationRead);

// --- DELETE a notification ---
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;
