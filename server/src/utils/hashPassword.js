const bcrypt = require('bcryptjs');

/**
 * Hash a plain password
 * @param {string} password - Plain password
 * @returns {Promise<string>} Hashed password
 */
async function hashPassword(password) {
	const salt = await bcrypt.genSalt(12);
	return await bcrypt.hash(password, salt);
}

/**
 * Compare a plain password with a hash
 * @param {string} password - Plain password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if match
 */
async function comparePassword(password, hash) {
	return await bcrypt.compare(password, hash);
}

module.exports = {
	hashPassword,
	comparePassword
};
