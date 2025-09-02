// Enhanced sample data generator
router.post('/generate-sample-data', auth, async (req, res) => {
  try {
    // Sample health records
    const sampleRecords = [
      {
        patientId: req.user.id, // Use current user's ID
        doctorName: "Dr. Rajesh Kumar",
        date: new Date(Date.now() - 30*24*60*60*1000),
        diagnosis: "Seasonal Influenza",
        prescription: "Paracetamol 500mg - 1 tablet three times daily for 5 days\nAdequate rest and fluid intake"
      },
      {
        patientId: req.user.id,
        doctorName: "Dr. Priya Singh",
        date: new Date(Date.now() - 90*24*60*60*1000),
        diagnosis: "Hypertension",
        prescription: "Amlodipine 5mg - 1 tablet daily\nRegular monitoring of BP\nLow salt diet"
      }
    ];
    await HealthRecord.deleteMany({ patientId: req.user.id });
    const records = await HealthRecord.insertMany(sampleRecords);
    successResponse(res, { records }, 'Sample data generated successfully');
  } catch (error) {
    errorResponse(res, 'Failed to generate sample data');
  }
});
const { successResponse, errorResponse } = require('../utils/apiResponse');
const HealthRecord = require('../models/HealthRecord');

// GET /api/records - Paginated health records for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let records = [];
    let total = 0;
    try {
      records = await HealthRecord.find({ patientId: req.user.id })
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 });
      total = await HealthRecord.countDocuments({ patientId: req.user.id });
    } catch (dbError) {
      return errorResponse(res, 'Database error while fetching records');
    }
    successResponse(res, {
      records,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    }, 'Records retrieved successfully');
  } catch (error) {
    errorResponse(res, 'Failed to fetch records');
  }
});
// routes/records.js - Enhanced version
const express = require('express');
const auth = require('../middleware/auth');
const HealthRecord = require('../models/HealthRecord');
const router = express.Router();

// GET /api/records - Get all health records for the logged-in patient
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Patients only.' 
      });
    }
    
    const records = await HealthRecord.find({ patientId: req.user._id })
      .sort({ date: -1 })
      .limit(10); // Limit to 10 recent records for demo
      
    // If no records, return sample data for demo
    if (records.length === 0) {
      const sampleRecords = [
        {
          doctorName: "Dr. Rajesh",
          date: new Date(Date.now() - 30*24*60*60*1000), // 30 days ago
          diagnosis: "Seasonal Flu",
          prescription: "Paracetamol 500mg, 3 times daily for 5 days"
        },
        {
          doctorName: "Dr. Priya",
          date: new Date(Date.now() - 90*24*60*60*1000), // 90 days ago
          diagnosis: "Regular Checkup",
          prescription: "Maintain healthy diet and exercise regularly"
        }
      ];
      
      return res.json({
        success: true,
        records: sampleRecords,
        message: "Sample records for demo purposes"
      });
    }
    
    res.json({
      success: true,
      records
    });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch health records' 
    });
  }
});

module.exports = router;