
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // multer


const {
  createReport,
  getAllReports,
  getUserReports,
  updateReportStatus,
  deleteReport,
} = require("../controllers/reportController");

// 🟢 CREATE REPORT (with media upload)
router.post("/", authMiddleware, upload.array("media", 5), createReport);

// 🟣 UNIFIED GET ROUTE — Admin gets all, user gets their own
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      // Admin: fetch all reports
      return getAllReports(req, res);
    } else {
      // Normal user: fetch only their own reports
      return getUserReports(req, res);
    }
  } catch (err) {
    console.error("Error in unified GET /reports:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🟡 UPDATE REPORT STATUS
router.put("/:id/status", authMiddleware, updateReportStatus);

// 🔴 DELETE REPORT
router.delete("/:id", authMiddleware, deleteReport);

module.exports = router;

