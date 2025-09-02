const { body, validationResult } = require('express-validator');
const { sendErrorResponse } = require('../utils/apiResponse');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    return sendErrorResponse(res, 'Validation failed', 400, errorMessages);
  }
  
  next();
};

// User registration validation
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('phone')
    .trim()
    .isMobilePhone('any', { strictMode: false })
    .withMessage('Please provide a valid phone number')
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 characters'),

  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('role')
    .trim()
    .isIn(['patient', 'doctor', 'pharmacist']),

  body('village')
    .if(body('role').equals('patient'))
    .notEmpty()
    .withMessage('Village is required for patients')
    .isLength({ min: 2, max: 100 })
    .withMessage('Village name must be between 2 and 100 characters'),
    
  // Conditional validations for doctors
  body('specialization')
    .if(body('role').equals('doctor'))
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Specialization is required for doctors and must be between 2 and 100 characters'),
    
  body('licenseNumber')
    .if(body('role').equals('doctor'))
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('License number is required for doctors and must be between 5 and 50 characters'),
    
  body('pharmacyId')
    .if(body('role').equals('pharmacist'))
    .isMongoId()
    .withMessage('Valid pharmacy ID is required for pharmacists'),
    
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone('any', { strictMode: false })
    .withMessage('Please provide a valid phone number'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
    
  handleValidationErrors
];

// Health record validation
const validateHealthRecord = [
  body('patientId')
    .isMongoId()
    .withMessage('Valid patient ID is required'),
    
  body('doctorName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Doctor name must be between 2 and 100 characters'),
    
  body('diagnosis')
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Diagnosis must be between 5 and 1000 characters'),
    
  body('prescription')
    .trim()
    .isLength({ min: 5, max: 2000 })
    .withMessage('Prescription must be between 5 and 2000 characters'),
    
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in valid ISO format'),
    
  body('symptoms')
    .optional()
    .isArray()
    .withMessage('Symptoms must be an array'),
    
  body('symptoms.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Each symptom must be between 1 and 100 characters'),
    
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
    
  body('recordType')
    .optional()
    .isIn(['consultation', 'checkup', 'emergency', 'followup', 'prescription'])
    .withMessage('Invalid record type'),
    
  handleValidationErrors
];

// Pharmacy validation
const validatePharmacy = [
  body('pharmacyName')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Pharmacy name must be between 2 and 200 characters'),
    
  body('location.address')
    .trim()
    .isLength({ min: 10, max: 300 })
    .withMessage('Address must be between 10 and 300 characters'),
    
  body('location.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
    
  body('location.state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
    
  body('location.pincode')
    .trim()
    .matches(/^\d{6}$/)
    .withMessage('Pincode must be a 6-digit number'),
    
  body('contactInfo.phone')
    .trim()
    .isMobilePhone('any', { strictMode: false })
    .withMessage('Please provide a valid phone number'),
    
  body('contactInfo.email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),
    
  body('licenseNumber')
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('License number must be between 5 and 50 characters'),
    
  handleValidationErrors
];

// Medicine inventory validation
const validateMedicine = [
  body('medicineName')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Medicine name must be between 2 and 200 characters'),
    
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
    
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
    
  body('expiryDate')
    .isISO8601()
    .withMessage('Expiry date must be in valid ISO format')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Expiry date must be in the future');
      }
      return true;
    }),
    
  body('category')
    .isIn(['prescription', 'over-the-counter', 'ayurvedic', 'homeopathic'])
    .withMessage('Invalid medicine category'),
    
  body('manufacturer')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Manufacturer name cannot exceed 100 characters'),
    
  body('dosage')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Dosage cannot exceed 100 characters'),
    
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
    
  handleValidationErrors
];

// Symptom checker validation
const validateSymptoms = [
  body('symptoms')
    .isArray({ min: 1 })
    .withMessage('At least one symptom is required'),
    
  body('symptoms.*')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Each symptom must be between 1 and 100 characters'),
    
  body('age')
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be between 0 and 150'),
    
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
    
  handleValidationErrors
];

// General MongoDB ID validation
const validateMongoId = (field = 'id') => [
  body(field)
    .isMongoId()
    .withMessage(`${field} must be a valid MongoDB ObjectId`),
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateHealthRecord,
  validatePharmacy,
  validateMedicine,
  validateSymptoms,
  validateMongoId,
  handleValidationErrors
};