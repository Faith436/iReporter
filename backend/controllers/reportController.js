// backend/controllers/reportController.js
const db = require("../config/db");
const path = require("path");

// --- CREATE REPORT ---
exports.createReport = async (req, res) => {
  try {
    console.log("=== CREATE REPORT START ===");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    console.log("User ID:", req.user.id);

    const { title, specificTitle, description, reportType, location, coordinates, date, status } = req.body;

    // Validate required fields
    if (!title || !description || !reportType) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        message: "Missing required fields: title, description, reportType",
      });
    }

    // --- Parse coordinates ---
    let latitude = null,
      longitude = null;
    if (coordinates) {
      try {
        const coordArray = coordinates.split(",").map((coord) => coord.trim());
        if (coordArray.length === 2) {
          latitude = parseFloat(coordArray[0]);
          longitude = parseFloat(coordArray[1]);
          if (isNaN(latitude) || isNaN(longitude)) {
            latitude = null;
            longitude = null;
          }
        }
      } catch (coordError) {
        console.log("❌ Coordinate parsing error:", coordError);
      }
    }

    // --- Handle media uploads ---
    let mediaPaths = [];
    if (req.files && req.files.length > 0) {
      mediaPaths = req.files.map(
        (file) => `/uploads/${file.destination.split("/")[1]}/${file.filename}`
      );
    }

    // --- Insert report into DB ---
    const [result] = await db.query(
      `INSERT INTO reports 
        (user_id, title, specific_title, description, report_type, status, location, lat, lng, media, date_reported)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        title,
        specificTitle || "",
        description,
        reportType,
        status || "pending",
        location,
        parseFloat(latitude) || 0,
        parseFloat(longitude) || 0,
        JSON.stringify(mediaPaths),
        date || new Date(),
      ]
    );

    console.log("✅ Database insert successful - ID:", result.insertId);

    // --- Add status history ---
    await db.query(
      "INSERT INTO status_history (report_id, status, note, changed_by) VALUES (?, ?, ?, ?)",
      [result.insertId, "pending", "Report submitted", req.user.id]
    );

    // --- Handle evidence uploads ---
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileType = file.mimetype.startsWith("image/") ? "image" : "video";
        await db.query(
          "INSERT INTO evidence (report_id, filename, file_path, file_type) VALUES (?, ?, ?, ?)",
          [result.insertId, file.filename, file.path, fileType]
        );
      }
    }

    // --- Fetch created report ---
    const [rows] = await db.query("SELECT * FROM reports WHERE id = ?", [result.insertId]);
    const report = rows[0];
    report.media = report.media ? JSON.parse(report.media) : [];

    res.status(201).json({
      success: true,
      message: "Report created successfully",
      report,
    });
  } catch (err) {
    console.error("❌ CREATE REPORT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error creating report",
    });
  }
};

// --- GET SINGLE REPORT ---
exports.getReport = async (req, res) => {
  try {
    const { id } = req.params;
    const [reports] = await db.query(
      `SELECT r.*, u.first_name, u.last_name 
       FROM reports r 
       LEFT JOIN users u ON r.user_id = u.id 
       WHERE r.id = ?`,
      [id]
    );

    if (reports.length === 0) {
      return res.status(404).json({ message: "Report not found" });
    }

    const report = reports[0];

    // --- Authorization check ---
    if (req.user.role === "user" && report.user_id !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // --- Fetch evidence and history ---
    const [evidence] = await db.query("SELECT * FROM evidence WHERE report_id = ?", [id]);
    const [history] = await db.query(
      `SELECT sh.*, u.first_name AS changed_by_name 
       FROM status_history sh 
       LEFT JOIN users u ON sh.changed_by = u.id 
       WHERE sh.report_id = ? 
       ORDER BY sh.created_at ASC`,
      [id]
    );

    report.evidence = evidence;
    report.history = history;
    report.media = report.media ? JSON.parse(report.media) : [];

    res.json({ report });
  } catch (error) {
    console.error("Get report error:", error);
    res.status(500).json({ message: "Server error fetching report" });
  }
};

// --- GET ALL REPORTS (ADMIN) ---
exports.getAllReports = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, u.first_name, u.last_name, u.email
      FROM reports r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);
    rows.forEach((r) => (r.media = r.media ? JSON.parse(r.media) : []));
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
    rows.forEach((r) => (r.media = r.media ? JSON.parse(r.media) : []));
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
    await db.query(
      "INSERT INTO status_history (report_id, status, note, changed_by) VALUES (?, ?, ?, ?)",
      [id, status, `Status updated to ${status}`, req.user.id]
    );
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

    // Only admin or owner can delete
    if (userRole !== "admin" && report[0].user_id !== userId)
      return res.status(403).json({ error: "Unauthorized" });

    await db.query("DELETE FROM reports WHERE id = ?", [id]);
    res.json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error("Delete report error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
