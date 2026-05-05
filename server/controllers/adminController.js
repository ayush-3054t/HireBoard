const User = require('../models/User');
const Recruiter = require('../models/Recruiter');
const Job = require('../models/Job');
const Application = require('../models/Application');

const dashboard = async (_req, res, next) => {
  try {
    const [totalUsers, totalRecruiters, totalJobs, pendingJobs, applications] = await Promise.all([
      User.countDocuments(),
      Recruiter.countDocuments(),
      Job.countDocuments(),
      Job.countDocuments({ status: 'pending' }),
      Application.countDocuments()
    ]);
    res.json({ totalUsers, totalRecruiters, totalJobs, pendingJobs, applications });
  } catch (error) {
    next(error);
  }
};

const paginated = async (Model, req, res, next, select = '-password') => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const [items, total] = await Promise.all([
      Model.find().select(select).sort('-createdAt').skip((page - 1) * limit).limit(limit),
      Model.countDocuments()
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

const listUsers = (req, res, next) => paginated(User, req, res, next);
const listRecruiters = (req, res, next) => paginated(Recruiter, req, res, next);

const listJobs = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 25;
    const [jobs, total] = await Promise.all([
      Job.find().populate('company recruiter', 'name email location').sort('-createdAt').skip((page - 1) * limit).limit(limit),
      Job.countDocuments()
    ]);
    res.json({ jobs, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

const toggleBlock = (Model) => async (req, res, next) => {
  try {
    const account = await Model.findById(req.params.id).select('-password');
    if (!account) {
      res.status(404);
      throw new Error('Account not found');
    }
    account.isBlocked = !account.isBlocked;
    await account.save();
    res.json(account);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  dashboard,
  listUsers,
  listRecruiters,
  listJobs,
  toggleUserBlock: toggleBlock(User),
  toggleRecruiterBlock: toggleBlock(Recruiter)
};
