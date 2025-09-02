// middleware/roleAuth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireRole = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    // Authenticate first
    async (req, res, next) => {
      try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
          return res.status(401).json({ 
            success: false,
            message: 'Access denied. No token provided.' 
          });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
          return res.status(401).json({ 
            success: false,
            message: 'Token is not valid.' 
          });
        }

        req.user = user;
        next();
      } catch (error) {
        res.status(401).json({ 
          success: false,
          message: 'Token is not valid.' 
        });
      }
    },
    // Check if user has required role
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied. Insufficient permissions.' 
        });
      }
      next();
    }
  ];
};

module.exports = requireRole;