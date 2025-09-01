const express = require('express');
const { body, query } = require('express-validator');
const {
  generateVideoToken,
  getActiveConsultations,
  joinConsultation,
  endConsultation,
  getConsultationHistory
} = require('../controllers/videoController');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

/**
 * @route   POST /api/video/token
 * @desc    Generate video call token
 * @access  Private (Patients and Doctors only)
 */
router.post('/token', [
  authenticate,
  authorize('patient', 'doctor'),
  body('channelName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 64 })
    .withMessage('Channel name must be between 1 and 64 characters'),
  body('patientId')
    .optional()
    .isMongoId()
    .withMessage('Valid patient ID is required'),
  body('doctorId')
    .optional()
    .isMongoId()
    .withMessage('Valid doctor ID is required'),
  handleValidationErrors
], generateVideoToken);

/**
 * @route   GET /api/video/consultations
 * @desc    Get active consultations for user
 * @access  Private (Patients and Doctors only)
 */
router.get('/consultations', [
  authenticate,
  authorize('patient', 'doctor')
], getActiveConsultations);

/**
 * @route   POST /api/video/consultations/:consultationId/join
 * @desc    Join an existing consultation
 * @access  Private (Patients and Doctors only)
 */
router.post('/consultations/:consultationId/join', [
  authenticate,
  authorize('patient', 'doctor')
], joinConsultation);

/**
 * @route   POST /api/video/consultations/end
 * @desc    End a video consultation
 * @access  Private (Patients and Doctors only)
 */
router.post('/consultations/end', [
  authenticate,
  authorize('patient', 'doctor'),
  body('consultationId')
    .notEmpty()
    .withMessage('Consultation ID is required'),
  body('duration')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Duration must be a non-negative integer'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  handleValidationErrors
], endConsultation);

/**
 * @route   GET /api/video/history
 * @desc    Get consultation history
 * @access  Private (Patients and Doctors only)
 */
router.get('/history', [
  authenticate,
  authorize('patient', 'doctor'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  handleValidationErrors
], getConsultationHistory);

module.exports = router;