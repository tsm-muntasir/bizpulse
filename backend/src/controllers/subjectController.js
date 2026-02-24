const asyncHandler = require('../utils/asyncHandler');
const subjectRepo = require('../repositories/subjectRepository');

const createSubject = asyncHandler(async (req, res) => {
  const doc = await subjectRepo.create({ ...req.body, userId: req.user.id });
  return res.status(201).json(doc);
});

const listSubjects = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 20), 100);
  const docs = await subjectRepo.listByUser(req.user.id, page, limit);
  return res.status(200).json({ page, limit, data: docs });
});

module.exports = { createSubject, listSubjects };
