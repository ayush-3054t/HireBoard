const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
  name: { type: String, required: true, trim: true },
  website: String,
  location: String,
  industry: String,
  description: String,
  logo: String
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
