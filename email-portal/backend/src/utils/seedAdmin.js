const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/database');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123456', // Change this in production!
      role: 'admin',
      isActive: true,
      canCreateEmails: true
    });

    console.log('Admin user created successfully:');
    console.log('Username: admin');
    console.log('Email: admin@example.com');
    console.log('Password: admin123456');
    console.log('\nPLEASE CHANGE THE PASSWORD AFTER FIRST LOGIN!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

seedAdmin();