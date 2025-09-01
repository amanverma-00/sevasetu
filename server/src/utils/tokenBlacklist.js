// Simple in-memory blacklist for JWT tokens
// For production, use Redis or a persistent store
const blacklistedTokens = new Set();

function blacklistToken(token) {
  blacklistedTokens.add(token);
}

function isTokenBlacklisted(token) {
  return blacklistedTokens.has(token);
}

module.exports = {
  blacklistToken,
  isTokenBlacklisted
};
