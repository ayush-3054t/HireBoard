const Company = require('../models/Company');
const Recruiter = require('../models/Recruiter');

const upsertCompany = async (req, res, next) => {
  try {
    const data = { ...req.body, recruiter: req.account._id };
    if (req.file) data.logo = `/uploads/${req.file.filename}`;
    const company = await Company.findOneAndUpdate(
      { recruiter: req.account._id },
      data,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    await Recruiter.findByIdAndUpdate(req.account._id, { company: company._id });
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
