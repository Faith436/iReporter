const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // ✅ multer

const {
  createReport,
  getAllReports,
  getUserReports,
  updateReportStatus,
  deleteReport,
} = require("../controllers/reportController");

// 🧠 Protected routes
router.post("/", authMiddleware, upload.array("media", 5), createReport);// handle file
router.get("/user", authMiddleware, getUserReports); // get user’s own reports
router.put("/:id/status", authMiddleware, updateReportStatus); // update status
router.delete("/:id", authMiddleware, deleteReport); // delete report

// 👑 Admin only
router.get("/all", authMiddleware, getAllReports); // all reports

module.exports = router;
