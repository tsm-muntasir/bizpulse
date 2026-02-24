const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true },
    jti: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: true },
    isRevoked: { type: Boolean, default: false },
    revokedAt: { type: Date },
    replacedByTokenId: { type: mongoose.Schema.Types.ObjectId, ref: 'RefreshToken' },
    userAgent: { type: String },
    ipAddress: { type: String }
  },
  { timestamps: true }
);

refreshTokenSchema.index({ userId: 1, jti: 1 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
