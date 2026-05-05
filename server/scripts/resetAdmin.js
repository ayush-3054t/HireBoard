const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

const reset = async () => {
  await connectDB();
  try {
    const admin = await Admin.findOne({ email: 'admin@example.com' });
    if (admin) {
      admin.password = 'admin123';
      await admin.save();
      console.log('Admin password reset to admin123');
    } else {
      console.log('Admin not found');
    }
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

reset();
