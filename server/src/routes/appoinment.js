const express = require('express');
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const router = express.Router();

// GET /api/appointments - Get user's appointments
router.get('/', auth, async (req, res) => {
  try {
    let query;
    if (req.user.role === 'patient') {
      query = { patientId: req.user._id };
    } else if (req.user.role === 'doctor') {
      query = { doctorId: req.user._id };
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const appointments = await Appointment.find(query)
      .populate('patientId', 'name phone')
      .populate('doctorId', 'name');
      
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// POST /api/appointments - Create a new appointment
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ error: 'Only patients can create appointments' });
    }
    
    const { doctorId, scheduledTime, symptoms } = req.body;
    
    // Generate a unique channel name for the appointment
    const channelName = `appointment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const appointment = new Appointment({
      patientId: req.user._id,
      doctorId,
      scheduledTime,
      symptoms,
      channelName
    });
    
    await appointment.save();
    await appointment.populate('doctorId', 'name');
    
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// PATCH /api/appointments/:id/status - Update appointment status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Check if user is authorized to update this appointment
    if (req.user.role === 'patient' && !appointment.patientId.equals(req.user._id)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (req.user.role === 'doctor' && !appointment.doctorId.equals(req.user._id)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    appointment.status = status;
    await appointment.save();
    
    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

module.exports = router;