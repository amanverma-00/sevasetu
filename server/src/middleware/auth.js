const { verifyToken } = require('../config/jwtConfig');
const User = require('../models/User');
const { sendErrorResponse } = require('../utils/apiResponse');

const { isTokenBlacklisted } = require('../utils/tokenBlacklist');
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendErrorResponse(res, 'Authentication required.', 401);
    }
    const token = authHeader.substring(7);
    if (isTokenBlacklisted(token)) {
      return sendErrorResponse(res, 'Token has been invalidated. Please login again.', 401);
    }
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user || !user.isActive) {
      return sendErrorResponse(res, 'Authentication required.', 401);
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendErrorResponse(res, 'Token expired. Please login again.', 401);
    } else if (error.name === 'JsonWebTokenError') {
      return sendErrorResponse(res, 'Invalid token.', 401);
    } else {
      console.error('Authentication error:', error);
      return sendErrorResponse(res, 'Authentication failed.', 401);
    }
  }
};

// Middleware to authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendErrorResponse(res, 'Authentication required.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendErrorResponse(res, `Access denied. Required role: ${roles.join(' or ')}`, 403);
    }

    next();
  };
};

// Middleware to check if user owns the resource or is authorized
const authorizeOwnerOrRole = (...authorizedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendErrorResponse(res, 'Authentication required.', 401);
    }

    // Check if user is the owner of the resource
    const resourceUserId = req.params.userId || req.body.patientId || req.query.userId;
    const isOwner = resourceUserId && req.user._id.toString() === resourceUserId.toString();

    // Check if user has authorized role
    const hasAuthorizedRole = authorizedRoles.includes(req.user.role);

    if (!isOwner && !hasAuthorizedRole) {
      return sendErrorResponse(res, 'Access denied. Insufficient permissions.', 403);
    }
    next();
  };
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (!isTokenBlacklisted(token)) {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.userId).select('-password');
        if (user && user.isActive) {
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  authorizeOwnerOrRole,
  optionalAuthenticate
};