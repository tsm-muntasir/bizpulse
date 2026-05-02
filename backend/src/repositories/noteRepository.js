const Note = require('../models/Note');

async function create(payload) {
  return Note.create(payload);
}

async function listByUser(userId, subjectId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return Note.find({ userId, ...(subjectId ? { subjectId } : {}) })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}

async function findById(id, userId) {
  return Note.findOne({ _id: id, userId });
}

async function updateSummary(id, userId, summary, keyPoints) {
  return Note.findByIdAndUpdate(
    { _id: id, userId },
    { summary, keyPoints },
    { new: true }
  );
}

async function deleteById(id, userId) {
  return Note.deleteOne({ _id: id, userId });
}

module.exports = { create, listByUser, findById, updateSummary, deleteById };
