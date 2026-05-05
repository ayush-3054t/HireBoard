const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { upsertCompany, myCompany } = require('../controllers/companyController');

const router = express.Router();

router.use(protect, authorize('recruiter'));
router.get('/me', myCompany);
router.put('/me', upload.single('logo'), upsertCompany);

module.exports = router;
