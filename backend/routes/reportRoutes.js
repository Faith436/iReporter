const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // your multer wrapper

const {
  createReport,
  getAllReports,
  getUserReports,
  updateReportStatus,
  deleteReport,
} = require("../controllers/reportController");

// 🟢 CREATE REPORT (fast insert + media path)
router.post("/", authMiddleware, upload, async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body cannot be empty" });
    }

    // Minimal processing for speed
    const { type, title, description, location, lat, lng } = req.body;
    const userId = req.user.id;

    // Save only file path
    const mediaPath = req.file ? `/uploads/${req.file.filename}` : null;

    // Direct DB insert — createReport can also return the inserted record
    const report = await createReport({
      type,
      title,
      description,
      location,
      lat,
      lng,
      media: mediaPath,
      userId,
    });

    // Return the inserted report immediately for frontend to update dashboard
    return res.status(201).json(report);
  } catch (err) {
    console.error("Error in POST /reports:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🟣 GET REPORTS — Admin gets all, user gets their own
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role === "admin") return getAllReports(req, res);
    return getUserReports(req, res);
  } catch (err) {
    console.error("Error in GET /reports:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🟡 UPDATE REPORT STATUS (with notifications)
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    if (!req.body || !req.body.status) {
      return res.status(400).json({ error: "Status is required" });
    }
    await updateReportStatus(req, res);
  } catch (err) {
    console.error("Error in PUT /reports/:id/status:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔴 DELETE REPORT
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await deleteReport(req, res);
  } catch (err) {
    console.error("Error in DELETE /reports/:id:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
