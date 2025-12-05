// controllers/userController.js
const db = require("../db");
const cloudinary = require("../cloudinary"); // your cloudinary config
const fs = require("fs");

// --- GET LOGGED-IN USER PROFILE ---
const getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT id, first_name, last_name, email, phone, bio, avatar, role 
      FROM users 
      WHERE id = ?
      `,
      [req.user.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    const u = rows[0];

    res.json({
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      phone: u.phone,
      bio: u.bio || "",
      avatar: u.avatar || "", // Already a Cloudinary URL
      role: u.role,
    });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- GET ALL USERS (ADMIN ONLY) ---
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      `
      SELECT id, first_name, last_name, email, phone, bio, avatar, role 
      FROM users
      `
    );

    res.json(
      users.map((u) => ({
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        phone: u.phone,
        bio: u.bio || "",
        avatar: u.avatar || "", // Cloudinary URL
        role: u.role,
      }))
    );
  } catch (err) {
    console.error("GET ALL USERS ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- UPDATE PROFILE ---
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, bio } = req.body;

    let avatarUrl = null;

    // Upload avatar to Cloudinary if file exists
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
        use_filename: true,
        unique_filename: false,
      });
      avatarUrl = result.secure_url;

      // Remove local file
      fs.unlinkSync(req.file.path);
    }

    const query = `
      UPDATE users 
      SET 
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        phone = COALESCE(?, phone),
        bio = COALESCE(?, bio),
        avatar = COALESCE(?, avatar)
      WHERE id = ?
    `;

    await db.query(query, [firstName, lastName, phone, bio, avatarUrl, userId]);

    const [rows] = await db.query(
      `
      SELECT id, first_name, last_name, email, phone, bio, avatar, role
      FROM users 
      WHERE id = ?
      `,
      [userId]
    );

    const u = rows[0];

    res.json({
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      phone: u.phone,
      bio: u.bio || "",
      avatar: u.avatar || "", // Cloudinary URL
      role: u.role,
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getProfile,
  getAllUsers,
  updateProfile,
};
