const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { dashboard, listUsers, listRecruiters, listJobs, toggleUserBlock, toggleRecruiterBlock } = require('../controllers/adminController');

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/dashboard', dashboard);
router.get('/users', listUsers);
router.patch('/users/:id/block', toggleUserBlock);
router.get('/recruiters', listRecruiters);
router.patch('/recruiters/:id/block', toggleRecruiterBlock);
router.get('/jobs', listJobs);

module.exports = router;
