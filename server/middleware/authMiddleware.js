const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Recruiter = require('../models/Recruiter');
const Admin = require('../models/Admin');

const modelByRole = { user: User, recruiter: Recruiter, admin: Admin };

const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401);
    return next(new Error('Not authorized, token missing'));
  }

  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    const Model = modelByRole[decoded.role];
    const account = Model ? await Model.findById(decoded.id).select('-password') : null;
    if (!account || account.isBlocked) {
      res.status(401);
      return next(new Error('Account unavailable or blocked'));
    }
    req.account = account;
    req.role = decoded.role;
    next();
  } catch (error) {
    res.status(401);
    next(new Error('Not authorized, token invalid'));
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.role)) {
    res.status(403);
    return next(new Error('Forbidden for this role'));
  }
  next();
};

module.exports = { protect, authorize };
