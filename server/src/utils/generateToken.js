const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'healthcare-app-super-secret-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_ISSUER = 'healthcare-app';
const JWT_AUDIENCE = 'healthcare-users';

/**
 * Generate a JWT token
 * @param {object} payload - Data to encode in token
 * @returns {string} JWT token
 */
function generateToken(payload) {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
		issuer: JWT_ISSUER,
		audience: JWT_AUDIENCE
	});
}

/**
 * Verify a JWT token
 * @param {string} token - JWT token
 * @returns {object} Decoded payload
 */
function verifyToken(token) {
	return jwt.verify(token, JWT_SECRET, {
		issuer: JWT_ISSUER,
		audience: JWT_AUDIENCE
	});
}

module.exports = {
	generateToken,
	verifyToken
};
