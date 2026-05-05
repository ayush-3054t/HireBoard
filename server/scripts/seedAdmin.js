const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('../models/Admin');

const run = async () => {
  const { ADMIN_NAME = 'Super Admin', ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI } = process.env;
  if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Set MONGO_URI, ADMIN_EMAIL, and ADMIN_PASSWORD in server/.env before running this script.');
    process.exit(1);
  }
  await mongoose.connect(MONGO_URI);
  const existing = await Admin.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log('Admin already exists:', ADMIN_EMAIL);
    process.exit(0);
  }
  await Admin.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  console.log('Admin created:', ADMIN_EMAIL);
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
