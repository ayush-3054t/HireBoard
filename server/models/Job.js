const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  requirements: [String],
  skills: [String],
  location: { type: String, required: true },
  salaryMin: Number,
  salaryMax: Number,
  jobType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'], default: 'Full-time' },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'closed'], default: 'pending' },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  deadline: Date
}, { timestamps: true });

jobSchema.index({ title: 'text', description: 'text', location: 'text', skills: 'text' });

module.exports = mongoose.model('Job', jobSchema);
