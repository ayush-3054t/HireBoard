const Job = require('../models/Job');
const Application = require('../models/Application');

const listJobs = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const query = req.role === 'admin' ? {} : { status: 'approved' };
    if (req.query.search) query.$text = { $search: req.query.search };
    if (req.query.location) query.location = new RegExp(req.query.location, 'i');
    if (req.query.jobType) query.jobType = req.query.jobType;
    if (req.query.salaryMin) query.salaryMax = { $gte: Number(req.query.salaryMin) };
    if (req.query.salaryMax) query.salaryMin = { $lte: Number(req.query.salaryMax) };

    const [jobs, total] = await Promise.all([
      Job.find(query).populate('company recruiter', 'name location industry').sort('-createdAt').skip((page - 1) * limit).limit(limit),
      Job.countDocuments(query)
    ]);
    res.json({ jobs, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('company recruiter', 'name location industry website');
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    res.json(job);
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const job = await Job.create({ ...req.body, recruiter: req.account._id, company: req.account.company || req.body.company });
    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndUpdate({ _id: req.params.id, recruiter: req.account._id }, req.body, { new: true });
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    res.json(job);
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const filter = req.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, recruiter: req.account._id };
    const job = await Job.findOneAndDelete(filter);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    await Application.deleteMany({ job: job._id });
    res.json({ message: 'Job deleted' });
  } catch (error) {
    next(error);
  }
};

const moderateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    res.json(job);
  } catch (error) {
    next(error);
  }
};

module.exports = { listJobs, getJob, createJob, updateJob, deleteJob, moderateJob };
