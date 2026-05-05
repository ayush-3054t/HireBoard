const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { dashboard } = require('../controllers/recruiterController');

const router = express.Router();

router.get('/dashboard', protect, authorize('recruiter'), dashboard);

module.exports = router;
