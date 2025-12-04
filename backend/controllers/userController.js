// controllers/userController.js
const db = require("../db");

// --- GET LOGGED-IN USER PROFILE ---
const getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, first_name, last_name, email, phone, bio, avatar, role 
       FROM users 
       WHERE id = ?`,
      [req.user.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    const user = rows[0];

    res.json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      bio: user.bio,
      avatar: user.avatar, // 👈 SENT TO FRONTEND
      role: user.role,
    });
  } catch (err) {
    console.error("GET PROFILE ERROR", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- GET ALL USERS (ADMIN ONLY) ---
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT id, first_name, last_name, email, phone, bio, avatar, role FROM users`
    );

    res.json(
      users.map((u) => ({
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        phone: u.phone,
        bio: u.bio,
        avatar: u.avatar,
        role: u.role,
      }))
    );
  } catch (err) {
    console.error("GET ALL USERS ERROR", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, bio } = req.body;

    // If avatar uploaded
    let avatarPath = null;
    if (req.file) {
      avatarPath = `/uploads/avatars/${req.file.filename}`;
    }

    const query = `
      UPDATE users 
      SET 
        first_name = ?, 
        last_name = ?, 
        phone = ?, 
        bio = ?, 
        avatar = COALESCE(?, avatar)
      WHERE id = ?
    `;

    await db.query(query, [
      firstName,
      lastName,
      phone,
      bio,
      avatarPath,
      userId,
    ]);

    // Fetch updated user
    const [rows] = await db.query(
      `SELECT id, first_name, last_name, email, phone, bio, avatar, role FROM users WHERE id = ?`,
      [userId]
    );

    const updatedUser = rows[0];

    res.json({
      id: updatedUser.id,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      bio: updatedUser.bio || "",
      avatar: updatedUser.avatar ? updatedUser.avatar : "",
      role: updatedUser.role,
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getProfile,
  getAllUsers,
  updateProfile, // 👈 ADD THIS
};
