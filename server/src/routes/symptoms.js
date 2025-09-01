const express = require('express');
const {
  checkSymptoms,
  getAvailableSymptoms,
  getSymptomCategories,
  checkAIServiceHealth
} = require('../controllers/symptomController');
const { authenticate, optionalAuthenticate } = require('../middleware/auth');
const { validateSymptoms } = require('../middleware/validation');

const router = express.Router();

/**
 * @route   POST /api/symptoms/check
 * @desc    Check symptoms using AI service
 * @access  Public (better results for authenticated users)
 */
router.post('/check', [
  optionalAuthenticate,
  validateSymptoms
], checkSymptoms);

/**
 * @route   GET /api/symptoms/available
 * @desc    Get list of available symptoms
 * @access  Public
 */
router.get('/available', getAvailableSymptoms);

/**
 * @route   GET /api/symptoms/categories
 * @desc    Get symptom categories
 * @access  Public
 */
router.get('/categories', getSymptomCategories);

/**
 * @route   GET /api/symptoms/health
 * @desc    Check AI service health status
 * @access  Public
 */
router.get('/health', checkAIServiceHealth);

module.exports = router;