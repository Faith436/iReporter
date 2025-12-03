const express = require("express");
const { authMiddleware, adminAuth } = require("../middleware/authMiddleware");
const db = require("../db"); // ensure consistent db import
const multer = require("multer");
const bcrypt = require("bcrypt");

const router = express.Router();

// --- Multer configuration for avatar uploads ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/avatars/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// --- GET user profile ---
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const [user] = await db.query(
      "SELECT id, first_name, last_name, email, phone, bio, avatar FROM users WHERE id = ?",
      [req.user.id]
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      bio: user.bio || "",
      avatar: user.avatar || "",
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error fetching profile" });
  }
});

// --- PUT update profile (name, bio, avatar) ---
router.put(
  "/profile",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const { firstName, lastName, bio, phone } = req.body;
      let avatar = req.file ? `/uploads/avatars/${req.file.filename}` : null;

      // Fetch current user data
      const [currentUser] = await db.query(
        "SELECT first_name, last_name, bio, phone, avatar FROM users WHERE id = ?",
        [req.user.id]
      );

      console.log("Incoming profile update:", req.body);


      if (!currentUser)
        return res.status(404).json({ message: "User not found" });

      const updates = {};

      // Only update fields that are NULL/empty in the DB
      if (
        (currentUser.first_name === null || currentUser.first_name === "") &&
        firstName
      )
        updates.first_name = firstName;
      if (
        (currentUser.last_name === null || currentUser.last_name === "") &&
        lastName
      )
        updates.last_name = lastName;
      if ((currentUser.bio === null || currentUser.bio === "") && bio)
        updates.bio = bio;
      if ((currentUser.phone === null || currentUser.phone === "") && phone)
        updates.phone = phone;
      if ((currentUser.avatar === null || currentUser.avatar === "") && avatar)
        updates.avatar = avatar;

      // Only run update if there’s something to update
      if (Object.keys(updates).length > 0) {
        await db.query("UPDATE users SET ? WHERE id = ?", [
          updates,
          req.user.id,
        ]);
      }

      // Fetch updated user
      const [updatedUser] = await db.query(
        "SELECT id, first_name, last_name, email, phone, bio, avatar FROM users WHERE id = ?",
        [req.user.id]
      );

      res.json({
        id: updatedUser.id,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        bio: updatedUser.bio || "",
        avatar: updatedUser.avatar || "",
      });
    } catch (err) {
      console.error("Update profile error:", err);
      res.status(500).json({ message: "Failed to update profile" });
    }
  }
);

// --- PUT change password ---
router.put("/password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const [user] = await db.query("SELECT password FROM users WHERE id = ?", [
      req.user.id,
    ]);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match)
      return res.status(400).json({ message: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      req.user.id,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Failed to change password" });
  }
});

module.exports = router;
