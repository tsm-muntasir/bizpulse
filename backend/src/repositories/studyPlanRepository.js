const StudyPlan = require('../models/StudyPlan');

async function create(payload) {
  return StudyPlan.create(payload);
}

async function listByUser(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return StudyPlan.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
}

module.exports = { create, listByUser };
