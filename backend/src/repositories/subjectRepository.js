const Subject = require('../models/Subject');

async function create(payload) {
  return Subject.create(payload);
}

async function listByUser(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return Subject.find({ userId }).sort({ examDate: 1 }).skip(skip).limit(limit);
}

module.exports = { create, listByUser };
