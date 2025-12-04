// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

// --- REGISTER USER ---
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  if (!firstName || !lastName || !email || !password)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0)
      return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (first_name, last_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, hashedPassword, phone || null, "user"]
    );

    const user = {
      id: result.insertId,
      firstName,
      lastName,
      email,
      phone,
      role: "user",
      avatar: "",
    };

    const token = jwt.sign(
      { id: user.id, email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ user, message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- LOGIN USER ---
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing email or password" });

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0)
      return res.status(400).json({ error: "Invalid email or password" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Build full image URL
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const avatarUrl = user.avatar
      ? `${baseUrl}/uploads/avatars/${user.avatar}`
      : "";

    return res.json({
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: avatarUrl,
      },
      message: "Login successful",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// --- GET CURRENT USER ---
const getCurrentUser = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, first_name, last_name, email, phone, role, avatar, firstLoginShown FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    const user = rows[0];
    const BASE_URL = `${req.protocol}://${req.get("host")}`;

    res.json({
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        firstLoginShown: user.firstLoginShown === 1,
        avatar: user.avatar ? `${BASE_URL}/uploads/${user.avatar}` : "",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- MARK FIRST LOGIN SEEN ---
const markFirstLoginSeen = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.query("UPDATE users SET firstLoginShown = 1 WHERE id = ?", [
      userId,
    ]);

    return res.json({
      success: true,
      message: "First login popup marked as seen",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// --- LOGOUT ---
const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  res.json({ message: "Logged out successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  markFirstLoginSeen,
};
