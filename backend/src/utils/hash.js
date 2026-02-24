const bcrypt = require('bcrypt');
const env = require('../config/env');

async function hashValue(value) {
  return bcrypt.hash(value, env.bcryptSaltRounds);
}

async function compareHash(value, hashed) {
  return bcrypt.compare(value, hashed);
}

module.exports = { hashValue, compareHash };
