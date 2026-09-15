const Company = require('../models/Company');
const Recruiter = require('../models/Recruiter');
const Job = require('../models/Job');
const { uploadFile } = require('../config/cloudinary');

const upsertCompany = async (req, res, next) => {
  try {
    const data = { ...req.body, recruiter: req.account._id };
    if (req.file) {
      const uploadedLogo = await uploadFile(req.file, {
        folder: 'hireboard/company-logos',
        resource_type: 'image',
        transformation: [{ width: 640, height: 640, crop: 'limit' }]
      });
      data.logo = uploadedLogo.secure_url;
    }
    const company = await Company.findOneAndUpdate(
      { recruiter: req.account._id },
      data,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    await Recruiter.findByIdAndUpdate(req.account._id, { company: company._id });
    await Job.updateMany(
      { recruiter: req.account._id, company: null },
      { company: company._id }
    );
    res.json(company);
  } catch (error) {
    next(error);
  }
};

const myCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({ recruiter: req.account._id });
    res.json(company);
  } catch (error) {
    next(error);
  }
};

module.exports = { upsertCompany, myCompany };
