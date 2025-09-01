const express = require('express');
const { RtmTokenBuilder, RtmRole } = require('agora-access-token');
const auth = require('../middleware/auth');
const router = express.Router();

// In a real application, you'd want to store messages in a database
// For the hackathon, we'll use an in-memory store (not suitable for production)
const messageStore = new Map(); // channelName -> array of messages

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
      token,
      userId
    });
  } catch (error) {
    console.error('Error generating messaging token:', error);
    res.status(500).json({ error: 'Failed to generate messaging token' });
  }
});

// GET /api/messaging/history - Get message history for a channel
router.get('/history', auth, (req, res) => {
  try {
    const channel = req.query.channel;
    if (!channel) {
      return res.status(400).json({ error: 'Channel name is required' });
    }
    
    const messages = messageStore.get(channel) || [];
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching message history:', error);
    res.status(500).json({ error: 'Failed to fetch message history' });
  }
});

// POST /api/messaging/store - Store a message (called by frontend after sending)
router.post('/store', auth, (req, res) => {
  try {
    const { channel, message, sender, timestamp } = req.body;
    
    if (!channel || !message) {
      return res.status(400).json({ error: 'Channel and message are required' });
    }
    
    if (!messageStore.has(channel)) {
      messageStore.set(channel, []);
    }
    
    const messages = messageStore.get(channel);
    messages.push({
      message,
      sender: sender || req.user.name,
      timestamp: timestamp || Date.now()
    });
    
    // Keep only the last 100 messages per channel
    if (messages.length > 100) {
      messages.splice(0, messages.length - 100);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error storing message:', error);
    res.status(500).json({ error: 'Failed to store message' });
  }
});

module.exports = router;