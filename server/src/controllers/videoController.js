const { generateAgoraToken } = require('../services/agoraService');
const User = require('../models/User');
const { 
  sendSuccessResponse, 
  sendErrorResponse, 
  asyncHandler 
} = require('../utils/apiResponse');

// Generate video call token
const generateVideoToken = asyncHandler(async (req, res) => {
  const { channelName, patientId, doctorId } = req.body;
  const userId = req.user._id;

  // Validate that the user is authorized for this call
  if (req.user.role === 'patient') {
    if (userId.toString() !== patientId?.toString()) {
      return sendErrorResponse(res, 'Patients can only join their own consultations', 403);
    }
  } else if (req.user.role === 'doctor') {
    if (userId.toString() !== doctorId?.toString()) {
      return sendErrorResponse(res, 'Doctors can only join consultations they are assigned to', 403);
    }
  } else {
    return sendErrorResponse(res, 'Only patients and doctors can join video consultations', 403);
  }

  try {
    // Generate unique channel name if not provided
    const finalChannelName = channelName || `consultation-${patientId}-${doctorId}-${Date.now()}`;
    
    // Generate Agora token
    const tokenData = generateAgoraToken(finalChannelName, userId.toString());

    // Prepare response data
    const responseData = {
      channelName: finalChannelName,
      token: tokenData.token,
      uid: tokenData.uid,
      expiry: tokenData.expiry,
      appId: process.env.AGORA_APP_ID,
      userRole: req.user.role,
      participant: {
        id: req.user._id,
        name: req.user.name,
        role: req.user.role
      }
    };

    // If this is a new consultation, you might want to log it
    logVideoConsultation(patientId, doctorId, finalChannelName, req.user);

    sendSuccessResponse(res, 'Video call token generated successfully', responseData);

  } catch (error) {
    console.error('Error generating video token:', error);
    return sendErrorResponse(res, 'Failed to generate video call token', 500);
  }
});

// Get active consultations for a user
const getActiveConsultations = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userRole = req.user.role;

  try {
    // In a production app, you'd query a consultations collection
    // For now, we'll return a mock response based on user role
    
    let consultations = [];

    if (userRole === 'doctor') {
      // Mock data for doctor's active consultations
      consultations = await getMockDoctorConsultations(userId);
    } else if (userRole === 'patient') {
      // Mock data for patient's active consultations
      consultations = await getMockPatientConsultations(userId);
    }

    sendSuccessResponse(res, 'Active consultations retrieved successfully', {
      consultations,
      total: consultations.length
    });

  } catch (error) {
    console.error('Error fetching consultations:', error);
    return sendErrorResponse(res, 'Failed to retrieve consultations', 500);
  }
});

// Join an existing consultation
const joinConsultation = asyncHandler(async (req, res) => {
  const { consultationId } = req.params;
  const userId = req.user._id;

  try {
    // In a real app, you'd query the database for the consultation
    // For now, we'll generate a token based on the consultation ID
    
    const channelName = `consultation-${consultationId}`;
    const tokenData = generateAgoraToken(channelName, userId.toString());

    const responseData = {
      consultationId,
      channelName,
      token: tokenData.token,
      uid: tokenData.uid,
      expiry: tokenData.expiry,
      appId: process.env.AGORA_APP_ID,
      participant: {
        id: req.user._id,
        name: req.user.name,
        role: req.user.role
      }
    };

    sendSuccessResponse(res, 'Joined consultation successfully', responseData);

  } catch (error) {
    console.error('Error joining consultation:', error);
    return sendErrorResponse(res, 'Failed to join consultation', 500);
  }
});

// End a video consultation
const endConsultation = asyncHandler(async (req, res) => {
  const { consultationId, duration, notes } = req.body;
  const userId = req.user._id;

  try {
    // Log consultation end
    logConsultationEnd(consultationId, userId, duration, notes);

    sendSuccessResponse(res, 'Consultation ended successfully', {
      consultationId,
      endedBy: {
        id: userId,
        name: req.user.name,
        role: req.user.role
      },
      duration,
      endTime: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error ending consultation:', error);
    return sendErrorResponse(res, 'Failed to end consultation', 500);
  }
});

// Get consultation history
const getConsultationHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const userId = req.user._id;
  const userRole = req.user.role;

  try {
    // Mock consultation history based on user role
    let history = [];
    
    if (userRole === 'doctor') {
      history = await getMockDoctorHistory(userId, page, limit);
    } else if (userRole === 'patient') {
      history = await getMockPatientHistory(userId, page, limit);
    }

    const total = history.length;

    sendSuccessResponse(res, 'Consultation history retrieved successfully', {
      history,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Error fetching consultation history:', error);
    return sendErrorResponse(res, 'Failed to retrieve consultation history', 500);
  }
});

// Helper functions for logging
const logVideoConsultation = (patientId, doctorId, channelName, initiator) => {
  try {
    console.log('Video Consultation Started:', {
      patientId,
      doctorId,
      channelName,
      initiatedBy: {
        id: initiator._id,
        name: initiator.name,
        role: initiator.role
      },
      timestamp: new Date().toISOString()
    });
    
    // In production, save to database
  } catch (error) {
    console.error('Failed to log video consultation:', error.message);
  }
};

const logConsultationEnd = (consultationId, userId, duration, notes) => {
  try {
    console.log('Video Consultation Ended:', {
      consultationId,
      endedBy: userId,
      duration,
      notes,
      timestamp: new Date().toISOString()
    });
    
    // In production, update consultation record in database
  } catch (error) {
    console.error('Failed to log consultation end:', error.message);
  }
};

// Mock data functions (replace with real database queries)
const getMockDoctorConsultations = async (doctorId) => {
  // Mock active consultations for a doctor
  return [
    {
      id: 'cons-001',
      patient: {
        id: 'patient-001',
        name: 'John Doe',
        phone: '+1234567890'
      },
      scheduledTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
      status: 'scheduled',
      type: 'follow-up'
    },
    {
      id: 'cons-002',
      patient: {
        id: 'patient-002',
        name: 'Jane Smith',
        phone: '+1234567891'
      },
      scheduledTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
      status: 'scheduled',
      type: 'consultation'
    }
  ];
};

const getMockPatientConsultations = async (patientId) => {
  // Mock active consultations for a patient
  return [
    {
      id: 'cons-003',
      doctor: {
        id: 'doctor-001',
        name: 'Dr. Sarah Johnson',
        specialization: 'General Medicine'
      },
      scheduledTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes from now
      status: 'scheduled',
      type: 'consultation'
    }
  ];
};

const getMockDoctorHistory = async (doctorId, page, limit) => {
  // Mock consultation history for a doctor
  return [
    {
      id: 'cons-hist-001',
      patient: { name: 'John Doe', phone: '+1234567890' },
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      duration: 25,
      type: 'consultation',
      notes: 'Regular checkup completed'
    },
    {
      id: 'cons-hist-002',
      patient: { name: 'Jane Smith', phone: '+1234567891' },
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      duration: 15,
      type: 'follow-up',
      notes: 'Medication adjustment discussed'
    }
  ];
};

const getMockPatientHistory = async (patientId, page, limit) => {
  // Mock consultation history for a patient
  return [
    {
      id: 'cons-hist-003',
      doctor: { name: 'Dr. Sarah Johnson', specialization: 'General Medicine' },
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      duration: 30,
      type: 'consultation',
      notes: 'Initial consultation completed'
    }
  ];
};

module.exports = {
  generateVideoToken,
  getActiveConsultations,
  joinConsultation,
  endConsultation,
  getConsultationHistory
};