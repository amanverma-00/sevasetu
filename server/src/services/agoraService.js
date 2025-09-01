const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

// Agora configuration
const AGORA_CONFIG = {
  appId: process.env.AGORA_APP_ID,
  appCertificate: process.env.AGORA_APP_CERTIFICATE,
  tokenExpiryTime: 3600 // 1 hour in seconds
};

/**
 * Generate Agora RTC token for video calls
 * @param {string} channelName - The channel name for the video call
 * @param {string} userId - The user ID (should be unique)
 * @param {string} role - User role ('publisher' or 'subscriber')
 * @returns {object} Token data including token, uid, and expiry
 */
const generateAgoraToken = (channelName, userId, role = 'publisher') => {
  try {
    // Validate required configuration
    if (!AGORA_CONFIG.appId || !AGORA_CONFIG.appCertificate) {
      throw new Error('Agora App ID and App Certificate are required');
    }

    if (!channelName || !userId) {
      throw new Error('Channel name and user ID are required');
    }

    // Generate a numeric UID from userId (Agora requires numeric UID)
    const uid = generateNumericUID(userId);

    // Set token expiry time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTime + AGORA_CONFIG.tokenExpiryTime;

    // Determine user role
    const agoraRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    // Generate the token
    const token = RtcTokenBuilder.buildTokenWithUid(
      AGORA_CONFIG.appId,
      AGORA_CONFIG.appCertificate,
      channelName,
      uid,
      agoraRole,
      privilegeExpiredTs
    );

    return {
      token,
      uid,
      channelName,
      appId: AGORA_CONFIG.appId,
      expiry: privilegeExpiredTs * 1000, // Convert to milliseconds
      expiryDate: new Date(privilegeExpiredTs * 1000).toISOString(),
      role: agoraRole === RtcRole.PUBLISHER ? 'publisher' : 'subscriber'
    };

  } catch (error) {
    console.error('Error generating Agora token:', error);
    throw new Error(`Failed to generate video call token: ${error.message}`);
  }
};

/**
 * Generate a token with string UID (for scenarios where string UID is supported)
 * @param {string} channelName - The channel name
 * @param {string} userId - The user ID as string
 * @param {string} role - User role
 * @returns {object} Token data
 */
const generateAgoraTokenWithStringUID = (channelName, userId, role = 'publisher') => {
  try {
    if (!AGORA_CONFIG.appId || !AGORA_CONFIG.appCertificate) {
      throw new Error('Agora App ID and App Certificate are required');
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTime + AGORA_CONFIG.tokenExpiryTime;
    const agoraRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    const token = RtcTokenBuilder.buildTokenWithAccount(
      AGORA_CONFIG.appId,
      AGORA_CONFIG.appCertificate,
      channelName,
      userId,
      agoraRole,
      privilegeExpiredTs
    );

    return {
      token,
      uid: userId,
      channelName,
      appId: AGORA_CONFIG.appId,
      expiry: privilegeExpiredTs * 1000,
      expiryDate: new Date(privilegeExpiredTs * 1000).toISOString(),
      role: agoraRole === RtcRole.PUBLISHER ? 'publisher' : 'subscriber'
    };

  } catch (error) {
    console.error('Error generating Agora token with string UID:', error);
    throw new Error(`Failed to generate video call token: ${error.message}`);
  }
};

/**
 * Generate a numeric UID from string userId
 * @param {string} userId - String user ID
 * @returns {number} Numeric UID
 */
const generateNumericUID = (userId) => {
  // Convert string to a consistent numeric value
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Ensure positive number and within Agora's UID range (0 to 2^32-1)
  return Math.abs(hash) % (Math.pow(2, 32) - 1);
};

/**
 * Validate Agora configuration
 * @returns {boolean} True if configuration is valid
 */
const validateAgoraConfig = () => {
  const required = ['appId', 'appCertificate'];
  const missing = required.filter(key => !AGORA_CONFIG[key]);
  
  if (missing.length > 0) {
    console.error('Missing Agora configuration:', missing);
    return false;
  }
  
  return true;
};

/**
 * Get Agora service status
 * @returns {object} Service status information
 */
const getAgoraServiceStatus = () => {
  const isConfigured = validateAgoraConfig();
  
  return {
    configured: isConfigured,
    appId: AGORA_CONFIG.appId ? `${AGORA_CONFIG.appId.substring(0, 8)}...` : 'Not set',
    tokenExpiryTime: AGORA_CONFIG.tokenExpiryTime,
    timestamp: new Date().toISOString()
  };
};

/**
 * Refresh token for ongoing call
 * @param {string} channelName - Channel name
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {object} New token data
 */
const refreshAgoraToken = (channelName, userId, role = 'publisher') => {
  // Generate new token with fresh expiry
  return generateAgoraToken(channelName, userId, role);
};

module.exports = {
  generateAgoraToken,
  generateAgoraTokenWithStringUID,
  generateNumericUID,
  validateAgoraConfig,
  getAgoraServiceStatus,
  refreshAgoraToken,
  AGORA_CONFIG
};