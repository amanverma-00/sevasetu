const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const router = express.Router();

// Generate Agora video token
const generateRtcToken = (channelName, uid, role) => {
  const appID = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  
  return RtcTokenBuilder.buildTokenWithUid(
    appID, 
    appCertificate, 
    channelName, 
    uid, 
    role, 
    privilegeExpiredTs
  );
};

// GET /api/video/token - Generate token for video call
router.get('/token', auth, async (req, res) => {
  try {
    const { channel } = req.query;
    
    if (!channel) {
      return res.status(400).json({ 
        success: false,
        message: 'Channel name is required' 
      });
    }
    
    // Verify user has access to this channel (appointment)
    const appointment = await Appointment.findOne({ 
      channelName: channel,
      $or: [{ patientId: req.user.id }, { doctorId: req.user.id }],
      status: { $in: ['scheduled', 'in-progress'] }
    });
    
    if (!appointment) {
      return res.status(403).json({ 
        success: false,
        message: 'Access to this video call is not authorized' 
      });
    }
    
    // Update appointment status if it's starting
    if (appointment.status === 'scheduled') {
      appointment.status = 'in-progress';
      await appointment.save();
    }
    
    const uid = req.user.id;
    const role = RtcRole.PUBLISHER;
    
    const token = generateRtcToken(channel, uid, role);
    
    res.json({
      success: true,
      token,
      channel,
      uid: uid.toString(),
      appId: process.env.AGORA_APP_ID
    });
  } catch (error) {
    console.error('Error generating video token:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate video token' 
    });
  }
});

module.exports = router;