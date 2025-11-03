const express = require('express');
const { createReport } = require('../controllers/reportController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', auth, upload.array('evidence', 5), createReport);

module.exports = router;
