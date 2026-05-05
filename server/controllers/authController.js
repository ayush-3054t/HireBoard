const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Recruiter = require('../models/Recruiter');
const Admin = require('../models/Admin');

const models = { user: User, recruiter: Recruiter, admin: Admin };

const signToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const publicAccount = (account) => {
  const obj = account.toObject();
  delete obj.password;
  return obj;
};

const register = async (req, res, next) => {
  try {
    const { role = 'user', name, email, password } = req.body;
    if (!['user', 'recruiter'].includes(role)) {
      res.status(400);
      throw new Error('Only user and recruiter self-registration is allowed');
    }
    const Model = models[role];
    if (await Model.findOne({ email })) {
      res.status(409);
      throw new Error('Email already registered');
    }
    const account = await Model.create({ name, email, password });
    res.status(201).json({ token: signToken(account._id, role), role, account: publicAccount(account) });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { role, email, password } = req.body;
    const Model = models[role];
    if (!Model) {
      res.status(400);
      throw new Error('Invalid role');
    }
    const account = await Model.findOne({ email });
    if (!account || !(await account.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid credentials');
    }
    if (account.isBlocked) {
      res.status(403);
      throw new Error('Account is blocked');
    }
    res.json({ token: signToken(account._id, role), role, account: publicAccount(account) });
  } catch (error) {
    next(error);
  }
};

const me = (req, res) => res.json({ role: req.role, account: req.account });

module.exports = { register, login, me };
