const Quiz = require('../models/Quiz');

async function create(payload) {
  return Quiz.create(payload);
}

async function listByUser(userId, subjectId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return Quiz.find({ userId, ...(subjectId ? { subjectId } : {}) })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}

async function findById(id, userId) {
  return Quiz.findOne({ _id: id, userId });
}

async function updateAttempts(quizId) {
  return Quiz.findByIdAndUpdate(quizId, { $inc: { totalAttempts: 1 } }, { new: true });
}

async function deleteById(id, userId) {
  return Quiz.deleteOne({ _id: id, userId });
}

module.exports = { create, listByUser, findById, updateAttempts, deleteById };
