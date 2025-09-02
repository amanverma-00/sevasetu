// routes/doctors.js
const express = require('express');
const requireRole = require('../middleware/roleAuth');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const router = express.Router();

// GET /api/doctors - Get all doctors (public endpoint)
router.get('/', async (req, res) => {
  try {
    const { specialization, page = 1, limit = 10 } = req.query;
    
    let query = { isApproved: true };
    if (specialization) {
      query.specialization = new RegExp(specialization, 'i');
    }
    
    const doctors = await Doctor.find(query)
      .populate('userId', 'name phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'rating.average': -1 });
    
    const total = await Doctor.countDocuments(query);
    
    res.json({
      success: true,
      doctors,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch doctors' 
    });
  }
});

// GET /api/doctors/:id - Get specific doctor
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'name phone address language');
    
    if (!doctor || !doctor.isApproved) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found' 
      });
    }
    
    res.json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch doctor' 
    });
  }
});

// PUT /api/doctors/profile - Update doctor profile (doctor only)
router.put('/profile', requireRole('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      doctor
    });
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update profile' 
    });
  }
});

// GET /api/doctors/:id/availability - Get doctor availability
router.get('/:id/availability', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .select('availability');
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found' 
      });
    }
    
    res.json({
      success: true,
      availability: doctor.availability
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch availability' 
    });
  }
});

module.exports = router;