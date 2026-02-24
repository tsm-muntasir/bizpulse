const Flashcard = require('../models/Flashcard');

async function insertMany(payload) {
  return Flashcard.insertMany(payload, { ordered: false });
}

async function listByUser(userId, subjectId, page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  return Flashcard.find({ userId, ...(subjectId ? { subjectId } : {}) }).skip(skip).limit(limit);
}

module.exports = { insertMany, listByUser };
