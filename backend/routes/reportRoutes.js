const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // ✅ your custom multer wrapper

const {
  createReport,
  getAllReports,
  getUserReports,
  updateReportStatus,
  deleteReport,
} = require("../controllers/reportController");

// 🟢 CREATE REPORT (with media upload)
router.post(
  "/",
  authMiddleware,
  upload, // directly use the middleware
  async (req, res) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Request body cannot be empty" });
      }
      await createReport(req, res);
    } catch (err) {
      console.error("Error in POST /reports:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// 🟣 UNIFIED GET ROUTE — Admin gets all, user gets their own
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return getAllReports(req, res);
    } else {
      return getUserReports(req, res);
    }
  } catch (err) {
    console.error("Error in GET /reports:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🟡 UPDATE REPORT STATUS
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
