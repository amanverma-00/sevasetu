const express = require('express');
const { body, query } = require('express-validator');
const {
  getPatientRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  getDoctorRecords,
  searchRecords,
  getRecordsByDateRange,
  getRecordStats,
  bulkSyncRecords
} = require('../controllers/recordController');
const { authenticate, authorize, authorizeOwnerOrRole } = require('../middleware/auth');
const { validateHealthRecord, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

/**
 * @route   GET /api/records
 * @desc    Get health records for authenticated user or specific patient
 * @access  Private (Patient: own records, Doctor: any patient records)
 */
router.get('/', [
  authenticate,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
], (req, res, next) => {
  // If no patientId specified in query, get records for current user or doctor's patients
  if (req.user.role === 'doctor') {
    return getDoctorRecords(req, res, next);
  } else {
    return getPatientRecords(req, res, next);
  }
});

/**
 * @route   GET /api/records/patient/:patientId
 * @desc    Get health records for specific patient
 * @access  Private (Patient: own records only, Doctor: any patient)
 */
router.get('/patient/:patientId', [
  authenticate,
  authorizeOwnerOrRole('doctor'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
], getPatientRecords);

/**
 * @route   GET /api/records/search
 * @desc    Search health records
 * @access  Private
 */
router.get('/search', [
  authenticate,
  query('query').notEmpty().withMessage('Search query is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
], searchRecords);

/**
 * @route   GET /api/records/date-range
 * @desc    Get records by date range
 * @access  Private
 */
router.get('/date-range', [
  authenticate,
  query('startDate').isISO8601().withMessage('Start date must be in ISO format'),
  query('endDate').isISO8601().withMessage('End date must be in ISO format'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
], getRecordsByDateRange);

/**
 * @route   GET /api/records/stats
 * @desc    Get record statistics
 * @access  Private
 */
router.get('/stats', authenticate, getRecordStats);

/**
 * @route   GET /api/records/:recordId
 * @desc    Get specific health record
 * @access  Private (Owner or Doctor who created it)
 */
router.get('/:recordId', authenticate, getRecordById);

/**
 * @route   POST /api/records
 * @desc    Create new health record
 * @access  Private (Doctors only)
 */
router.post('/', [
  authenticate,
  authorize('doctor'),
  validateHealthRecord
], createRecord);

/**
 * @route   PUT /api/records/:recordId
 * @desc    Update health record
 * @access  Private (Doctor who created it only)
 */
router.put('/:recordId', [
  authenticate,
  authorize('doctor'),
  body('diagnosis')
    .optional()
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Diagnosis must be between 5 and 1000 characters'),
  body('prescription')
    .optional()
    .trim()
    .isLength({ min: 5, max: 2000 })
    .withMessage('Prescription must be between 5 and 2000 characters'),
  body('symptoms')
    .optional()
    .isArray()
    .withMessage('Symptoms must be an array'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  body('followUpDate')
    .optional()
    .isISO8601()
    .withMessage('Follow-up date must be in ISO format'),
  body('recordType')
    .optional()
    .isIn(['consultation', 'checkup', 'emergency', 'followup', 'prescription'])
    .withMessage('Invalid record type'),
  handleValidationErrors
], updateRecord);

/**
 * @route   DELETE /api/records/:recordId
 * @desc    Delete health record
 * @access  Private (Doctor who created it only)
 */
router.delete('/:recordId', [
  authenticate,
  authorize('doctor')
], deleteRecord);

/**
 * @route   POST /api/records/sync
 * @desc    Bulk sync records for offline functionality
 * @access  Private (Patients only)
 */
router.post('/sync', [
  authenticate,
  authorize('patient'),
  body('records')
    .isArray({ min: 1 })
    .withMessage('Records array is required and cannot be empty'),
  body('records.*.diagnosis')
    .optional()
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Diagnosis must be between 5 and 1000 characters'),
  body('records.*.prescription')
    .optional()
    .trim()
    .isLength({ min: 5, max: 2000 })
    .withMessage('Prescription must be between 5 and 2000 characters'),
  body('records.*.doctorName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Doctor name must be between 2 and 100 characters'),
  handleValidationErrors
], bulkSyncRecords);

module.exports = router;