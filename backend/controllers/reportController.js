// controllers/reportController.js
const db = require("../db");
const path = require("path");

// --- CREATE REPORT ---
exports.createReport = async (req, res) => {
  const user = req.user; // authenticated user
  const { title, specificTitle, description, location, status, lat, lng } = req.body;

  console.log("🟢 Incoming report data:", req.body);
  console.log("🟢 Uploaded files:", req.files);
  console.log("🟢 Authenticated user:", req.user);

  if (!title || !description || !location) {
    return res.status(400).json({ error: "Title, description, and location are required" });
  }

  // Handle multiple media files
  let mediaPaths = [];
  if (req.files && req.files.length > 0) {
    mediaPaths = req.files.map(file => `/uploads/${file.destination.split("/")[1]}/${file.filename}`);
  }

  try {
    const [result] = await db.query(
      `INSERT INTO reports (user_id, title, specific_title, description, status, location, lat, lng, media)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        title,
        specificTitle || "",
        description,
        status || "pending",
        location,
        parseFloat(lat) || 0,
        parseFloat(lng) || 0,
        JSON.stringify(mediaPaths)
      ]
    );

    // fetch the newly created report
    const [rows] = await db.query("SELECT * FROM reports WHERE id = ?", [result.insertId]);
    const report = rows[0];
    report.media = report.media ? JSON.parse(report.media) : [];

    res.status(201).json({ message: "Report created successfully", report });
  } catch (err) {
    console.error("Create report error:", err.message, err.stack);
    res.status(500).json({ error: "Server error" });
  }
};

// --- GET ALL REPORTS (Admin only) ---
exports.getAllReports = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, u.first_name, u.last_name, u.email
      FROM reports r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);
    rows.forEach(r => (r.media = r.media ? JSON.parse(r.media) : []));
    res.json(rows);
  } catch (err) {
    console.error("Get all reports error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- GET USER REPORTS ---
exports.getUserReports = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    rows.forEach(r => (r.media = r.media ? JSON.parse(r.media) : []));
    res.json(rows);
  } catch (err) {
    console.error("Get user reports error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- UPDATE REPORT STATUS (Admin only) ---
exports.updateReportStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "under investigation", "resolved", "rejected"].includes(status))
    return res.status(400).json({ error: "Invalid status" });

  try {
    await db.query("UPDATE reports SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: "Report status updated successfully" });
  } catch (err) {
    console.error("Update report status error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- DELETE REPORT ---
exports.deleteReport = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const [report] = await db.query("SELECT * FROM reports WHERE id = ?", [id]);
    if (report.length === 0)
      return res.status(404).json({ error: "Report not found" });

    // Only admin or report owner can delete
    if (userRole !== "admin" && report[0].user_id !== userId)
      return res.status(403).json({ error: "Unauthorized" });

    await db.query("DELETE FROM reports WHERE id = ?", [id]);
    res.json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error("Delete report error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
