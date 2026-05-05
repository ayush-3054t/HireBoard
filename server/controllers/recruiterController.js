const Job = require('../models/Job');
const Application = require('../models/Application');

const dashboard = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.account._id }).populate('company').sort('-createdAt');
    const applications = await Application.find({ recruiter: req.account._id }).populate('job user', 'title name email').sort('-createdAt');
    res.json({
      totalJobs: jobs.length,
      approvedJobs: jobs.filter((job) => job.status === 'approved').length,
      pendingJobs: jobs.filter((job) => job.status === 'pending').length,
      applicantsCount: applications.length,
      jobs,
      recentApplications: applications.slice(0, 10)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { dashboard };
