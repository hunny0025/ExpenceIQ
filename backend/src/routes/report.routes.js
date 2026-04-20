const express = require('express');
const router = express.Router();
const { exportCSV, exportPDF } = require('../controllers/report.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/csv', exportCSV);
router.get('/pdf', exportPDF);

module.exports = router;
