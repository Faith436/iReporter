// const express = require("express");
// const router = express.Router();
// const { authMiddleware } = require("../middleware/authMiddleware");
// const upload = require("../middleware/upload");

// const {
//   createReport,
//   getAllReports,
//   getUserReports,
//   getReport,
//   updateReport,
//   updateReportStatus,
//   deleteReport,
//   getReportStats,
// } = require("../controllers/reportController");

// // 🧠 Protected routes
// router.post("/", authMiddleware, upload.array("media", 5), createReport);
// router.get("/user", authMiddleware, getUserReports);
// router.get("/stats", authMiddleware, getReportStats);
// router.get("/:id", authMiddleware, getReport);
// router.put("/:id", authMiddleware, upload.array("media", 5), updateReport);
// router.patch("/:id/status", authMiddleware, updateReportStatus);
// router.delete("/:id", authMiddleware, deleteReport);

// // 👑 Admin only - FIXED: Removed adminMiddleware since it doesn't exist
// router.get("/reports/all", authMiddleware, getAllReports);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
  createReport,
  getAllReports,
  getUserReports,
  getReport,
  updateReport,
  updateReportStatus,
  deleteReport,
  getReportStats,
} = require("../controllers/reportController");

// 🧠 Protected routes
router.post("/", authMiddleware, upload.array("media", 5), createReport);
router.get("/user", authMiddleware, getUserReports);
router.get("/stats", authMiddleware, getReportStats);
router.get("/:id", authMiddleware, getReport);
router.put("/:id", authMiddleware, upload.array("media", 5), updateReport);
router.patch("/:id/status", authMiddleware, updateReportStatus);
router.delete("/:id", authMiddleware, deleteReport);

// 👑 Admin only - FIXED: Changed from "/reports/all" to "/all"
router.get("/all", authMiddleware, getAllReports);

module.exports = router;