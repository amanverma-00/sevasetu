const express = require('express');
const { RtmTokenBuilder, RtmRole } = require('agora-access-token');
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const router = express.Router();

// In-memory message store (for demo purposes - consider Redis for production)
const messageStore = new Map();

// Generate Agora RTM (Real-Time Messaging) token
const generateRtmToken = (userId) => {
  const appID = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  
  return RtmTokenBuilder.buildToken(
    appID, 
    appCertificate, 
    userId, 
    RtmRole.RTM_USER, 
    privilegeExpiredTs
  );
};

// GET /api/messaging/token - Generate token for real-time messaging
router.get('/token', auth, (req, res) => {
  try {
    const userId = req.user._id.toString();
    const token = generateRtmToken(userId);
    
    res.json({
      success: true,
      token,
      userId
    });
  } catch (error) {
    console.error('Error generating messaging token:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate messaging token' 
    });
  }
});

// GET /api/messaging/history - Get message history for a channel
router.get('/history', auth, async (req, res) => {
  try {
    const { channel } = req.query;
    
    if (!channel) {
      return res.status(400).json({ 
        success: false,
        message: 'Channel name is required' 
      });
    }
    
    // Verify user has access to this channel
    const appointment = await Appointment.findOne({ 
      channelName: channel,
      $or: [{ patientId: req.user.id }, { doctorId: req.user.id }]
    });
    
    if (!appointment) {
      return res.status(403).json({ 
        success: false,
        message: 'Access to this chat is not authorized' 
      });
    }
    
    const messages = messageStore.get(channel) || [];
    
    res.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error fetching message history:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch message history' 
    });
  }
});

// POST /api/messaging/store - Store a message
router.post('/store', auth, async (req, res) => {
  try {
    const { channel, message, timestamp } = req.body;
    
    if (!channel || !message) {
      return res.status(400).json({ 
        success: false,
        message: 'Channel and message are required' 
      });
    }
    
    // Verify user has access to this channel
    const appointment = await Appointment.findOne({ 
      channelName: channel,
      $or: [{ patientId: req.user.id }, { doctorId: req.user.id }]
    });
    
    if (!appointment) {
      return res.status(403).json({ 
        success: false,
        message: 'Access to this chat is not authorized' 
      });
    }
    
    if (!messageStore.has(channel)) {
      messageStore.set(channel, []);
    }
    
    const messages = messageStore.get(channel);
    messages.push({
      message,
      sender: req.user.name,
      senderId: req.user._id.toString(),
      timestamp: timestamp || Date.now()
    });
    
    // Keep only the last 100 messages per channel
    if (messages.length > 100) {
      messages.splice(0, messages.length - 100);
    }
    
    res.json({ 
      success: true,
      message: 'Message stored successfully'
    });
  } catch (error) {
    console.error('Error storing message:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to store message' 
    });
  }
});

module.exports = router;