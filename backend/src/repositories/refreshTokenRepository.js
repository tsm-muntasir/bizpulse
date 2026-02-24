const RefreshToken = require('../models/RefreshToken');

async function createToken(payload) {
  return RefreshToken.create(payload);
}

async function findActiveByJti(jti) {
  return RefreshToken.findOne({ jti, isRevoked: false, expiresAt: { $gt: new Date() } });
}

async function revokeToken(id, replacedByTokenId = null) {
  return RefreshToken.findByIdAndUpdate(
    id,
    { isRevoked: true, revokedAt: new Date(), replacedByTokenId },
    { new: true }
  );
}

async function revokeAllForUser(userId) {
  return RefreshToken.updateMany({ userId, isRevoked: false }, { isRevoked: true, revokedAt: new Date() });
}

module.exports = { createToken, findActiveByJti, revokeToken, revokeAllForUser };
