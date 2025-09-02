const express = require('express');
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
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
      return res.status(403).json({ 
        success: false,
        message: 'Access denied' 
      });
    }
    
    const appointments = await Appointment.find(query)
      .populate('patientId', 'name phone')
      .populate('doctorId', 'name')
      .sort({ scheduledTime: 1 });
      
    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch appointments' 
    });
  }
});

// POST /api/appointments - Create a new appointment
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ 
        success: false,
        message: 'Only patients can create appointments' 
      });
    }
    
    const { doctorId, scheduledTime, symptoms, duration } = req.body;
    
    // Validate doctor exists and is actually a doctor
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found' 
      });
    }
    
    // Check if the doctor is available at the requested time
    const conflictingAppointment = await Appointment.findOne({
      doctorId,
      scheduledTime: {
        $gte: new Date(new Date(scheduledTime).getTime() - (duration || 30) * 60000),
        $lte: new Date(new Date(scheduledTime).getTime() + (duration || 30) * 60000)
      },
      status: { $in: ['scheduled', 'in-progress'] }
    });
    
    if (conflictingAppointment) {
      return res.status(409).json({ 
        success: false,
        message: 'Doctor is not available at the requested time' 
      });
    }
    
    // Generate a unique channel name for the appointment
    const channelName = `appointment_${uuidv4()}`;
    
    const appointment = new Appointment({
      patientId: req.user._id,
      doctorId,
      scheduledTime,
      symptoms,
      duration: duration || 30,
      channelName
    });
    
    await appointment.save();
    await appointment.populate('doctorId', 'name');
    
    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create appointment' 
    });
  }
});

// PATCH /api/appointments/:id/status - Update appointment status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: 'Appointment not found' 
      });
    }
    
    // Check if user is authorized to update this appointment
    if (req.user.role === 'patient' && !appointment.patientId.equals(req.user._id)) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied' 
      });
    }
    
    if (req.user.role === 'doctor' && !appointment.doctorId.equals(req.user._id)) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied' 
      });
    }
    
    appointment.status = status;
    await appointment.save();
    
    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update appointment' 
    });
  }
});

// GET /api/appointments/doctors - Get list of doctors
router.get('/doctors', auth, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('name specialization');
    
    res.json({
      success: true,
      doctors
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch doctors' 
    });
  }
});

module.exports = router;