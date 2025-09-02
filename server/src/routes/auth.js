// routes/auth.js - Enhanced version
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const router = express.Router();

// POST /api/auth/register - Enhanced for role-specific registration
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, role, dateOfBirth, gender, address, language, ...roleData } = req.body;

    // Check if user already exists
    const oldUser = await User.findOne({ phone });
    if (oldUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this phone number.' 
      });
    }

    // Create new user
    const newUser = new User({ 
      name, 
      phone, 
      password, 
      role,
      dateOfBirth,
      gender,
      address,
      language
    });

    // Create role-specific profile
    if (role === 'doctor') {
      const doctorProfile = new Doctor({
        userId: newUser._id,
        licenseNumber: roleData.licenseNumber,
        specialization: roleData.specialization,
        qualifications: roleData.qualifications,
        experience: roleData.experience,
        hospital: roleData.hospital,
        consultationFee: roleData.consultationFee,
        languagesSpoken: roleData.languagesSpoken
      });
      await doctorProfile.save();
      newUser.doctorProfile = doctorProfile._id;
    } else if (role === 'patient') {
      const patientProfile = new Patient({
        userId: newUser._id,
        emergencyContact: roleData.emergencyContact,
        bloodGroup: roleData.bloodGroup,
        allergies: roleData.allergies,
        chronicConditions: roleData.chronicConditions
      });
      await patientProfile.save();
      newUser.patientProfile = patientProfile._id;
    }

    await newUser.save();

    // Populate user data based on role
    let userData = await User.findById(newUser._id);
    if (role === 'doctor') {
      userData = await userData.populate('doctorProfile');
    } else if (role === 'patient') {
      userData = await userData.populate('patientProfile');
    }

    // Generate JWT Token
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        role: newUser.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully!',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration.' 
    });
  }
});

// POST /api/auth/login - Enhanced to return role-specific data
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Check if user exists and password is correct
    const user = await User.findOne({ phone }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid phone number or password' 
      });
    }

    // Populate user data based on role
    let userData = user.toObject();
    delete userData.password;
    
    if (user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ userId: user._id });
      userData.doctorProfile = doctorProfile;
    } else if (user.role === 'patient') {
      const patientProfile = await Patient.findOne({ userId: user._id });
      userData.patientProfile = patientProfile;
    }

    // Generate JWT Token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login.' 
    });
  }
});

module.exports = router;