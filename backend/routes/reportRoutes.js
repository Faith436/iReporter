const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // multer wrapper

const {
  createReport,
  getAllReports,
  getUserReports,
  updateReportStatus,
  deleteReport,
} = require("../controllers/reportController");

// 🟢 CREATE REPORT
// multer handles multiple files in 'media'
// controller handles validation, DB insert, notifications, and email
router.post("/", authMiddleware, upload.array("media", 5), async (req, res) => {
  try {
    await createReport(req, res);
  } catch (err) {
    console.error("Error in POST /reports:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🟣 GET REPORTS — Admin gets all, user gets their own
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return getAllReports(req, res);
    }
    return getUserReports(req, res);
  } catch (err) {
    console.error("Error in GET /reports:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🟡 UPDATE REPORT STATUS
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
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
