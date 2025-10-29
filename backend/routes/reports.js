const express = require('express');
const {
  getReports,
  getReport,
  createReport,
  updateReportStatus,
  updateReport,
  deleteReport
} = require('../controllers/reportController');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// All routes are protected
router.use(auth);

router.get('/', getReports);
router.get('/:id', getReport);
router.post('/', upload.array('evidence', 5), createReport);
router.put('/:id', updateReport);
router.patch('/:id/status', adminAuth, updateReportStatus);
router.delete('/:id', deleteReport);

module.exports = router;