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