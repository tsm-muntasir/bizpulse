const User = require('../models/User');

async function findByEmail(email) {
  return User.findOne({ email }).select('+passwordHash');
}

async function findPublicById(id) {
  return User.findById(id).select('-passwordHash');
}

async function createUser(payload) {
  return User.create(payload);
}

async function updateLastLogin(id) {
  return User.findByIdAndUpdate(id, { lastLoginAt: new Date() }, { new: true });
}

module.exports = { findByEmail, findPublicById, createUser, updateLastLogin };
