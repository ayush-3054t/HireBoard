const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { updateProfile, saveJob, dashboard } = require('../controllers/userController');

const router = express.Router();

router.use(protect, authorize('user'));
router.get('/dashboard', dashboard);
router.put('/profile', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'profilePhoto', maxCount: 1 }]), updateProfile);
router.post('/saved/:jobId', saveJob);

module.exports = router;
