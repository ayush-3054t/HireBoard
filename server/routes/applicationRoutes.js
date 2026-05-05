const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const validate = require('../middleware/validate');
const { applyToJob, myApplications, jobApplicants, updateApplicationStatus } = require('../controllers/applicationController');

const router = express.Router();

router.post('/jobs/:jobId', protect, authorize('user'), upload.single('resume'), applyToJob);
router.get('/me', protect, authorize('user'), myApplications);
router.get('/jobs/:jobId/applicants', protect, authorize('recruiter'), jobApplicants);
router.patch('/:id/status', protect, authorize('recruiter'), [
  body('status').isIn(['applied', 'reviewing', 'accepted', 'rejected']).withMessage('Invalid status'),
  validate
], updateApplicationStatus);

module.exports = router;
