// controllers/reportController.js
const db = require("../db");
const path = require("path");

// --- CREATE REPORT ---
exports.createReport = async (req, res) => {
  const user = req.user;

  const body = req.body || {};
  const {
    title = "",
    description = "",
    location = "",
    status = "pending",
    type = "general",
    lat,
    lng,
  } = body;

  if (!title.trim() || !description.trim() || !location.trim()) {
    return res.status(400).json({
      error: "Title, description, and location are required",
    });
  }

  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);

  const finalLat = isNaN(parsedLat) ? 0 : parsedLat;
  const finalLng = isNaN(parsedLng) ? 0 : parsedLng;

  let mediaPaths = [];
  if (req.files && req.files.length > 0) {
    mediaPaths = req.files.map(
      (file) => `/uploads/${file.destination.split("/")[1]}/${file.filename}`
    );
  }

  try {
    // --- Insert report ---
    const [result] = await db.query(
      `INSERT INTO reports (user_id, title, description, type, status, location, lat, lng, media)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        title,
        description,
        type,
        status,
        location,
        finalLat,
        finalLng,
        JSON.stringify(mediaPaths),
      ]
    );

    const [rows] = await db.query("SELECT * FROM reports WHERE id = ?", [
      result.insertId,
    ]);

    const report = rows[0];
    report.media = JSON.parse(report.media || "[]");

    /** ------------------------------------------
     * 🔥 CREATE ADMIN NOTIFICATION
     * ------------------------------------------ */
    const ADMIN_ID = 1; // <-- Change if needed

    // Fetch user full name
    const [userRow] = await db.query(
      "SELECT first_name, last_name, email FROM users WHERE id = ?",
      [user.id]
    );

    const firstName = userRow[0]?.first_name || "";
    const lastName = userRow[0]?.last_name || "";
    const email = userRow[0]?.email || "Unknown";

    const displayName =
      firstName || lastName ? `${firstName} ${lastName}`.trim() : email;

    const message = `New report created by ${displayName}: ${title}`;

    await db.execute(
      "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
      [ADMIN_ID, message]
    );

    /** ------------------------------------------ */

    res.status(201).json({ message: "Report created successfully", report });
  } catch (err) {
    console.error("Create report error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- GET ALL REPORTS (Admin only) ---
exports.getAllReports = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, u.id as user_id, u.first_name, u.last_name, u.email
      FROM reports r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);

    rows.forEach((r) => (r.media = r.media ? JSON.parse(r.media) : []));

    const mappedRows = rows.map((r) => ({
      ...r,
      createdBy: r.user_id,
      userName: `${r.first_name} ${r.last_name}`,
    }));

    res.json(mappedRows);
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

    rows.forEach((r) => (r.media = r.media ? JSON.parse(r.media) : []));

    const mappedRows = rows.map((r) => ({
      ...r,
      createdBy: r.user_id,
    }));

    res.json(mappedRows);
  } catch (err) {
    console.error("Get user reports error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- UPDATE REPORT STATUS (Admin only) ---
exports.updateReportStatus = async (req, res) => {
  const { id } = req.params;

  // Handle missing body
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: "Request body cannot be empty",
    });
  }

  const { status } = req.body;

  // Handle missing status field
  if (!status) {
    return res.status(400).json({
      error: "Status field is required",
    });
  }

  const allowed = ["pending", "under-investigation", "resolved", "rejected"];

  // Handle invalid status value
  if (!allowed.includes(status)) {
    return res.status(400).json({
      error:
        "Invalid status. Allowed: pending, under-investigation, resolved, rejected",
    });
  }

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

  try {
    const [report] = await db.query("SELECT * FROM reports WHERE id = ?", [id]);
    if (report.length === 0)
      return res.status(404).json({ error: "Report not found" });

    // Only admin or owner can delete
    if (userId !== report[0].user_id)
      return res.status(403).json({ error: "Unauthorized" });

    await db.query("DELETE FROM reports WHERE id = ?", [id]);
    res.json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error("Delete report error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
