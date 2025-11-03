const express = require("express");
const router = express.Router();
const {
  getUserNotifications,
  markNotificationRead,
  deleteNotification,
} = require("../controllers/notificationController");
const { authMiddleware } = require("../middleware/authMiddleware");

// All routes require user to be logged in
router.use(authMiddleware);

// Get logged-in user notifications
router.get("/", getUserNotifications);

// Mark notification as read
router.patch("/:id/read", markNotificationRead);

// Delete a notification
router.delete("/:id", deleteNotification);

module.exports = router;
