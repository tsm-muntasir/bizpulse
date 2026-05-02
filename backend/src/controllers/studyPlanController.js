const asyncHandler = require('../utils/asyncHandler');
const studyPlanRepo = require('../repositories/studyPlanRepository');
const aiService = require('../services/aiService');

const listStudyPlans = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 20), 100);
  const docs = await studyPlanRepo.listByUser(req.user.id, page, limit);
  return res.status(200).json({ page, limit, data: docs });
});

const generateStudyPlan = asyncHandler(async (req, res) => {
  const doc = await aiService.generateStudyPlan(req.user.id, req.body);
  return res.status(201).json(doc);
});

module.exports = { listStudyPlans, generateStudyPlan };
