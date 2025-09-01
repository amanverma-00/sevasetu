/**
 * Standardized API response utility functions
 */

// Success response
const sendSuccessResponse = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Error response
const sendErrorResponse = (res, message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// Paginated response
const sendPaginatedResponse = (res, message, data, pagination, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      currentPage: pagination.page,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      totalItems: pagination.total,
      itemsPerPage: pagination.limit,
      hasNextPage: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrevPage: pagination.page > 1
    },
    timestamp: new Date().toISOString()
  });
};

// Authentication response (includes token)
const sendAuthResponse = (res, message, user, token, refreshToken = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
    data: {
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        ...(user.role === 'doctor' && { 
          specialization: user.specialization,
          licenseNumber: user.licenseNumber 
        }),
        ...(user.role === 'pharmacist' && { 
          pharmacyId: user.pharmacyId 
        })
      },
      accessToken: token
    },
    timestamp: new Date().toISOString()
  };

  if (refreshToken) {
    response.data.refreshToken = refreshToken;
  }

  return res.status(statusCode).json(response);
};

// Health check response
const sendHealthResponse = (res) => {
  return res.status(200).json({
    success: true,
    message: 'Healthcare API is running',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || '1.0.0'
  });
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Custom error class
class ApiError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error response for validation failures
const sendValidationErrorResponse = (res, errors) => {
  const formattedErrors = errors.map(error => ({
    field: error.path || error.param,
    message: error.msg || error.message,
    value: error.value
  }));

  return sendErrorResponse(res, 'Validation failed', 400, formattedErrors);
};

// Response for not found resources
const sendNotFoundResponse = (res, resource = 'Resource') => {
  return sendErrorResponse(res, `${resource} not found`, 404);
};

// Response for unauthorized access
const sendUnauthorizedResponse = (res, message = 'Unauthorized access') => {
  return sendErrorResponse(res, message, 401);
};

// Response for forbidden access
const sendForbiddenResponse = (res, message = 'Access forbidden') => {
  return sendErrorResponse(res, message, 403);
};

// Response for conflict (e.g., duplicate data)
const sendConflictResponse = (res, message = 'Conflict occurred') => {
  return sendErrorResponse(res, message, 409);
};

// Response for rate limiting
const sendRateLimitResponse = (res, message = 'Too many requests') => {
  return sendErrorResponse(res, message, 429);
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
  sendPaginatedResponse,
  sendAuthResponse,
  sendHealthResponse,
  sendValidationErrorResponse,
  sendNotFoundResponse,
  sendUnauthorizedResponse,
  sendForbiddenResponse,
  sendConflictResponse,
  sendRateLimitResponse,
  asyncHandler,
  ApiError
};