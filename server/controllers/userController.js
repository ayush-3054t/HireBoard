const User = require('../models/User');
const Application = require('../models/Application');
const Job = require('../models/Job');

const updateProfile = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (typeof updates.skills === 'string') updates.skills = updates.skills.split(',').map((s) => s.trim()).filter(Boolean);
    
    if (req.files) {
      if (req.files['resume'] && req.files['resume'][0]) {
        updates.resume = `/uploads/resumes/${req.files['resume'][0].filename}`;
      }
      if (req.files['profilePhoto'] && req.files['profilePhoto'][0]) {
        updates.profilePhoto = `/uploads/profile/${req.files['profilePhoto'][0].filename}`;
      }
    }
    
    delete updates.password;
    const user = await User.findByIdAndUpdate(req.account._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const saveJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    const user = await User.findById(req.account._id);
    const exists = user.savedJobs.some((id) => id.toString() === req.params.jobId);
    user.savedJobs = exists ? user.savedJobs.filter((id) => id.toString() !== req.params.jobId) : [...user.savedJobs, job._id];
    await user.save();
    res.json({ savedJobs: user.savedJobs, saved: !exists });
  } catch (error) {
    next(error);
  }
};

const dashboard = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.account._id }).populate({ path: 'job', populate: 'company' }).sort('-createdAt');
    const savedJobs = await User.findById(req.account._id).populate('savedJobs').select('savedJobs name email skills location phone resume profilePhoto');
    res.json({
      totalApplications: applications.length,
      accepted: applications.filter((app) => app.status === 'accepted').length,
      reviewing: applications.filter((app) => app.status === 'reviewing').length,
      applications,
      savedJobs: savedJobs.savedJobs,
      user: {
        name: savedJobs.name,
        email: savedJobs.email,
        skills: savedJobs.skills,
        location: savedJobs.location,
        phone: savedJobs.phone,
        resume: savedJobs.resume,
        profilePhoto: savedJobs.profilePhoto
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateProfile, saveJob, dashboard };
