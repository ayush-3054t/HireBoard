const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { listJobs, getJob, createJob, updateJob, deleteJob, moderateJob } = require('../controllers/jobController');

const router = express.Router();

router.get('/', listJobs);
router.get('/:id', getJob);
router.post('/', protect, authorize('recruiter'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('location').notEmpty().withMessage('Location is required'),
  validate
], createJob);
router.put('/:id', protect, authorize('recruiter'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);
router.patch('/:id/status', protect, authorize('admin'), [
  body('status').isIn(['pending', 'approved', 'rejected', 'closed']).withMessage('Invalid status'),
  validate
], moderateJob);

module.exports = router;
