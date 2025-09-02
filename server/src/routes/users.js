// routes/users.js
const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');
const router = express.Router();

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    successResponse(res, user, 'Profile retrieved successfully');
  } catch (error) {
    errorResponse(res, 'Failed to retrieve profile');
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, dateOfBirth, gender, address } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, dateOfBirth, gender, address },
      { new: true, runValidators: true }
    ).select('-password');
    
    successResponse(res, updatedUser, 'Profile updated successfully');
  } catch (error) {
    errorResponse(res, 'Failed to update profile');
  }
});

module.exports = router;