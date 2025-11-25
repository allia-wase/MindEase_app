const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, university, studentId, phone, dateOfBirth } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { studentId }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or student ID already exists' 
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      university,
      studentId,
      phone,
      dateOfBirth
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        university: user.university,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error creating user',
      error: error.message 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        university: user.university,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error during login',
      error: error.message 
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user data',
      error: error.message 
    });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'emergencyContact', 'preferences'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    const user = await User.findById(req.user.userId);
    updates.forEach(update => user[update] = req.body[update]);
    await user.save();

    res.json({ 
      message: 'Profile updated successfully',
      user 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error updating profile',
      error: error.message 
    });
  }
});

module.exports = router;
