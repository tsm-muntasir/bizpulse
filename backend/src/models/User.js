const mongoose = require('mongoose');
const { STUDENT, ADMIN } = require('../constants/roles');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    university: { type: String, required: true, enum: ['IUBAT', 'University of Dhaka', 'North South University'] },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: [STUDENT, ADMIN], default: STUDENT, index: true },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
