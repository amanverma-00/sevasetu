const User = require('../models/User');
const Pharmacy = require('../models/Pharmacy');
const { generateToken } = require('../config/jwtConfig');
const { 
  sendSuccessResponse, 
  sendErrorResponse, 
  sendAuthResponse,
  sendConflictResponse,
  asyncHandler 
} = require('../utils/apiResponse');
const { blacklistToken } = require('../utils/tokenBlacklist');
// Logout user and blacklist JWT token
const logout = asyncHandler(async (req, res) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendErrorResponse(res, 'No token provided', 400);
  }
  const token = authHeader.substring(7);
  blacklistToken(token);
  sendSuccessResponse(res, 'Logout successful. Token invalidated.');
});

// Register a new user
const register = asyncHandler(async (req, res) => {
  const { name, phone, password, role, specialization, licenseNumber, pharmacyId } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return sendConflictResponse(res, 'User with this phone number already exists');
  }

  // Prepare user data
  const userData = {
    name,
    phone,
    password,
    role: role.toLowerCase()
  };

  // Add role-specific fields
  if (role.toLowerCase() === 'doctor') {
    userData.specialization = specialization;
    userData.licenseNumber = licenseNumber;
  }

  if (role.toLowerCase() === 'pharmacist') {
    // Verify pharmacy exists
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return sendErrorResponse(res, 'Invalid pharmacy ID', 400);
    }
    userData.pharmacyId = pharmacyId;
  }

  // Create user
  const user = new User(userData);
  await user.save();

  // Generate JWT token
  const token = generateToken({
    userId: user._id,
    phone: user.phone,
    role: user.role
  });

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  sendAuthResponse(res, 'User registered successfully', userResponse, token, null, 201);
});

// Login user
const login = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  // Find user with password
  const user = await User.findByPhoneWithPassword(phone);
  if (!user) {
    return sendErrorResponse(res, 'Invalid phone number or password', 401);
  }

  // Check if account is active
  if (!user.isActive) {
    return sendErrorResponse(res, 'Account is deactivated. Please contact support.', 401);
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return sendErrorResponse(res, 'Invalid phone number or password', 401);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate JWT token
  const token = generateToken({
    userId: user._id,
    phone: user.phone,
    role: user.role
  });

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  sendAuthResponse(res, 'Login successful', userResponse, token);
});

// Get current user profile
const getProfile = asyncHandler(async (req, res) => {
  // User is already attached to req by auth middleware
  const user = await User.findById(req.user._id)
    .populate('pharmacyId', 'pharmacyName location')
    .select('-password');

  if (!user) {
    return sendErrorResponse(res, 'User not found', 404);
  }

  sendSuccessResponse(res, 'Profile retrieved successfully', user);
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, specialization } = req.body;
  const userId = req.user._id;

  // Prepare update data
  const updateData = {};
  if (name) updateData.name = name;
  
  // Role-specific updates
  if (req.user.role === 'doctor' && specialization) {
    updateData.specialization = specialization;
  }

  // Update user
  const user = await User.findByIdAndUpdate(
    userId, 
    updateData, 
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return sendErrorResponse(res, 'User not found', 404);
  }

  sendSuccessResponse(res, 'Profile updated successfully', user);
});

// Change password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  // Get user with password
  const user = await User.findById(userId).select('+password');
  if (!user) {
    return sendErrorResponse(res, 'User not found', 404);
  }

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return sendErrorResponse(res, 'Current password is incorrect', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  sendSuccessResponse(res, 'Password changed successfully');
});

// Deactivate account
const deactivateAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true }
  ).select('-password');

  if (!user) {
    return sendErrorResponse(res, 'User not found', 404);
  }

  sendSuccessResponse(res, 'Account deactivated successfully');
});

// Get user statistics (admin/analytics)
const getUserStats = asyncHandler(async (req, res) => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
        active: { 
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        }
      }
    }
  ]);

  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });

  sendSuccessResponse(res, 'User statistics retrieved successfully', {
    total: totalUsers,
    active: activeUsers,
    byRole: stats
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deactivateAccount,
  getUserStats,
  logout
};