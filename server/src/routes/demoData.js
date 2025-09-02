// routes/demoData.js
const express = require('express');
const Pharmacy = require('../models/Pharmacy');
const HealthRecord = require('../models/HealthRecord');
const User = require('../models/User');
const router = express.Router();

// Generate sample pharmacies with medicine data
router.post('/generate-sample-data', async (req, res) => {
  try {
    // Sample pharmacies with medicine inventory
    const samplePharmacies = [
      {
        pharmacyName: "Nabha Medical Store",
        location: "Near Civil Hospital, Nabha",
        inventory: [
          { medicineName: "Paracetamol", quantity: 150, price: 15 },
          { medicineName: "Amoxicillin", quantity: 80, price: 45 },
          { medicineName: "Metformin", quantity: 60, price: 32 },
          { medicineName: "Aspirin", quantity: 120, price: 18 },
          { medicineName: "Atorvastatin", quantity: 40, price: 55 }
        ]
      },
      {
        pharmacyName: "Punjab Pharmacy",
        location: "Main Market, Nabha",
        inventory: [
          { medicineName: "Paracetamol", quantity: 90, price: 16 },
          { medicineName: "Insulin", quantity: 30, price: 220 },
          { medicineName: "Losartan", quantity: 50, price: 48 },
          { medicineName: "Amoxicillin", quantity: 110, price: 42 },
          { medicineName: "Omeprazole", quantity: 70, price: 38 }
        ]
      }
    ];

    // Clear existing and insert sample data
    await Pharmacy.deleteMany({});
    const insertedPharmacies = await Pharmacy.insertMany(samplePharmacies);

    res.json({
      success: true,
      message: 'Sample data generated successfully',
      pharmacies: insertedPharmacies
    });
  } catch (error) {
    console.error('Error generating sample data:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate sample data' 
    });
  }
});

// Get all pharmacies with medicine data
router.get('/pharmacies-with-medicines', async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({});
    res.json({
      success: true,
      pharmacies
    });
  } catch (error) {
    console.error('Error fetching pharmacies:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch pharmacies' 
    });
  }
});

module.exports = router;