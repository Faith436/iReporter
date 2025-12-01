// routes/users.js
const express = require("express");
const { authMiddleware, adminAuth } = require("../middleware/authMiddleware");
const db = require("../db"); // ensure consistent db import

const router = express.Router();

// --- Get all users (Admin only) ---
router.get("/", authMiddleware, adminAuth, async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, first_name, last_name, email, phone, role, firstloginshown FROM users"
    );

    res.json(
      users.map((u) => ({
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        firstLoginShown: u.firstloginshown, // include this for frontend check
      }))
    );
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error fetching users" });
  }
});

// --- Update user role (Admin only) ---
router.patch("/:id/role", authMiddleware, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const [result] = await db.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ message: "Server error updating role" });
  }
});

// --- Update first login shown flag (User only) ---
router.put("/:id/first-login-shown", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { firstloginshown } = req.body;

    if (firstloginshown === undefined) {
      return res.status(400).json({ message: "firstloginshown is required" });
    }

    const [result] = await db.query(
      "UPDATE users SET firstloginshown = ? WHERE id = ?",
      [firstloginshown, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "First login flag updated successfully" });
  } catch (error) {
    console.error("Update first login error:", error);
    res.status(500).json({ message: "Server error updating first login flag" });
  }
});

module.exports = router;
