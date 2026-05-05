const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/db');
const Recruiter = require('../models/Recruiter');
const Company = require('../models/Company');
const Job = require('../models/Job');

const seedJobs = async () => {
  await connectDB();

  try {
    // Create dummy recruiter
    let recruiter = await Recruiter.findOne({ email: 'recruiter@example.com' });
    if (!recruiter) {
      recruiter = await Recruiter.create({
        name: 'John Recruiter',
        email: 'recruiter@example.com',
        password: 'password123'
      });
    }

    // Create dummy company
    let company = await Company.findOne({ name: 'Acme Corp' });
    if (!company) {
      company = await Company.create({
        name: 'Acme Corp',
        location: 'New York, NY',
        industry: 'Technology',
        website: 'https://acme.com',
        description: 'A leading technology company.',
        recruiter: recruiter._id
      });
    }

    // Assign company to recruiter
    recruiter.company = company._id;
    await recruiter.save();

    // Create jobs
    const jobs = [
      {
        title: 'Senior Frontend Developer',
        description: 'Looking for an experienced React developer to lead our frontend team.',
        location: 'Remote',
        salaryMin: 110000,
        salaryMax: 150000,
        jobType: 'Remote',
        skills: ['React', 'Tailwind', 'JavaScript'],
        status: 'approved',
        recruiter: recruiter._id,
        company: company._id
      },
      {
        title: 'Backend Node.js Engineer',
        description: 'Build scalable APIs using Express and MongoDB.',
        location: 'San Francisco, CA',
        salaryMin: 120000,
        salaryMax: 160000,
        jobType: 'Full-time',
        skills: ['Node.js', 'Express', 'MongoDB'],
        status: 'approved',
        recruiter: recruiter._id,
        company: company._id
      },
      {
        title: 'UI/UX Designer',
        description: 'Design beautiful interfaces for our new product lines.',
        location: 'Austin, TX',
        salaryMin: 90000,
        salaryMax: 130000,
        jobType: 'Full-time',
        skills: ['Figma', 'UI Design', 'CSS'],
        status: 'approved',
        recruiter: recruiter._id,
        company: company._id
      },
      {
        title: 'DevOps Specialist',
        description: 'Maintain CI/CD pipelines and Kubernetes clusters.',
        location: 'Remote',
        salaryMin: 100000,
        salaryMax: 140000,
        jobType: 'Contract',
        skills: ['Kubernetes', 'Docker', 'AWS'],
        status: 'approved',
        recruiter: recruiter._id,
        company: company._id
      }
    ];

    await Job.insertMany(jobs);
    console.log('Successfully seeded jobs!');
  } catch (error) {
    console.error('Error seeding jobs:', error);
  } finally {
    process.exit(0);
  }
};

seedJobs();
