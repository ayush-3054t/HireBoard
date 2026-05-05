const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const educationSchema = new mongoose.Schema({
  school: String,
  degree: String,
  year: String
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  company: String,
  role: String,
  duration: String,
  description: String
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  phone: String,
  location: String,
  skills: [String],
  education: [educationSchema],
  experience: [experienceSchema],
  resume: String,
  profilePhoto: String,
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  isBlocked: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function matchPassword(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
