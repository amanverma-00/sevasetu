// routes/mockEndpoints.js
const express = require('express');
const router = express.Router();

// Mock video consultation availability
router.get('/video-availability', (req, res) => {
  res.json({
    success: true,
    available: true,
    message: "Video consultation will be available in the next version"
  });
});

// Mock doctor availability
router.get('/doctors-availability', (req, res) => {
  const doctors = [
    {
      id: 1,
      name: "Dr. Sharma",
      specialization: "General Physician",
      available: true,
      nextAvailable: "10:30 AM"
    },
    {
      id: 2,
      name: "Dr. Kaur",
      specialization: "Pediatrician",
      available: false,
      nextAvailable: "2:00 PM"
    }
  ];
  
  res.json({
    success: true,
    doctors
  });
});

// Mock appointment slots
router.get('/appointment-slots', (req, res) => {
  const slots = [
    { time: "09:00 AM", available: false },
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: true },
    { time: "12:00 PM", available: false },
    { time: "01:00 PM", available: true },
    { time: "02:00 PM", available: true },
    { time: "03:00 PM", available: true },
    { time: "04:00 PM", available: false }
  ];
  
  res.json({
    success: true,
    slots
  });
});

// Mock chat availability
router.get('/chat-status', (req, res) => {
  res.json({
    success: true,
    chatEnabled: false,
    message: "Real-time chat will be implemented in the next version"
  });
});

module.exports = router;