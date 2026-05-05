const Application = require('../models/Application');
const Job = require('../models/Job');

const applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, status: 'approved' });
    if (!job) {
      res.status(404);
      throw new Error('Approved job not found');
    }
    const application = await Application.create({
      job: job._id,
      user: req.account._id,
      recruiter: job.recruiter,
      coverLetter: req.body.coverLetter,
      resume: req.file ? `/uploads/resumes/${req.file.filename}` : req.account.resume
    });
    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      res.status(409);
      return next(new Error('You already applied to this job'));
    }
    next(error);
  }
};

const myApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.account._id }).populate({ path: 'job', populate: 'company' }).sort('-createdAt');
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

const jobApplicants = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, recruiter: req.account._id });
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    const applications = await Application.find({ job: job._id }).populate('user', 'name email skills resume profilePhoto location').sort('-createdAt');
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, recruiter: req.account._id },
      { status: req.body.status },
      { new: true }
    ).populate('user job');
    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }
    res.json(application);
  } catch (error) {
    next(error);
  }
};

module.exports = { applyToJob, myApplications, jobApplicants, updateApplicationStatus };
