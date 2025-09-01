const express = require('express');
const { query } = require('express-validator');
const {
  getAllPharmacies,
  getPharmacyById,
  createPharmacy,
  updatePharmacy,
  updateInventory,
  searchMedicines,
  getPharmacyInventory,
  deleteMedicine,
  getPharmacyStats
} = require('../controllers/pharmacyController');
const { authenticate, authorize, optionalAuthenticate } = require('../middleware/auth');
const { validatePharmacy, validateMedicine, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

/**
 * @route   GET /api/pharmacies
 * @desc    Get all pharmacies with filtering and pagination
 * @access  Public
 */
router.get('/', [
  optionalAuthenticate,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('city').optional().trim().isLength({ min: 2 }).withMessage('City must be at least 2 characters'),
  query('search').optional().trim().isLength({ min: 2 }).withMessage('Search query must be at least 2 characters'),
  handleValidationErrors
], getAllPharmacies);

/**
 * @route   GET /api/pharmacies/search-medicines
 * @desc    Search for medicines across all pharmacies
 * @access  Public
 */
router.get('/search-medicines', [
  query('medicine').notEmpty().withMessage('Medicine name is required'),
  query('city').optional().trim().isLength({ min: 2 }).withMessage('City must be at least 2 characters'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  handleValidationErrors
], searchMedicines);

/**
 * @route   GET /api/pharmacies/:pharmacyId
 * @desc    Get pharmacy details by ID
 * @access  Public
 */
router.get('/:pharmacyId', getPharmacyById);

/**
 * @route   GET /api/pharmacies/:pharmacyId/inventory
 * @desc    Get pharmacy inventory
 * @access  Public (limited info) / Private (full info for pharmacy staff)
 */
router.get('/:pharmacyId/inventory', [
  optionalAuthenticate,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isIn(['prescription', 'over-the-counter', 'ayurvedic', 'homeopathic']).withMessage('Invalid category'),
  query('search').optional().trim().isLength({ min: 2 }).withMessage('Search query must be at least 2 characters'),
  query('available').optional().isBoolean().withMessage('Available must be true or false'),
  handleValidationErrors
], getPharmacyInventory);

/**
 * @route   GET /api/pharmacies/:pharmacyId/stats
 * @desc    Get pharmacy statistics
 * @access  Private (Pharmacy staff only)
 */
router.get('/:pharmacyId/stats', [
  authenticate,
  authorize('pharmacist')
], getPharmacyStats);

/**
 * @route   POST /api/pharmacies
 * @desc    Create a new pharmacy
 * @access  Private (Admin functionality - for now allowing any authenticated user)
 */
router.post('/', [
  authenticate,
  validatePharmacy
], createPharmacy);

/**
 * @route   POST /api/pharmacies/inventory
 * @desc    Update pharmacy inventory (add/update medicine)
 * @access  Private (Pharmacists only)
 */
router.post('/inventory', [
  authenticate,
  authorize('pharmacist'),
  validateMedicine
], updateInventory);

/**
 * @route   PUT /api/pharmacies/:pharmacyId
 * @desc    Update pharmacy information
 * @access  Private (Pharmacists for their own pharmacy, Admin for any)
 */
router.put('/:pharmacyId', [
  authenticate,
  authorize('pharmacist'), // For now, only pharmacists can update
  validatePharmacy
], updatePharmacy);

/**
 * @route   DELETE /api/pharmacies/inventory/:medicineId
 * @desc    Remove medicine from inventory
 * @access  Private (Pharmacists only)
 */
router.delete('/inventory/:medicineId', [
  authenticate,
  authorize('pharmacist')
], deleteMedicine);

module.exports = router;