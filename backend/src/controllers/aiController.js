const asyncHandler = require('../utils/asyncHandler');
const aiService = require('../services/aiService');

const generateStudyPlan = asyncHandler(async (req, res) => {
  const doc = await aiService.generateStudyPlan(req.user.id, req.body);
  return res.status(201).json(doc);
});

const generateFlashcards = asyncHandler(async (req, res) => {
  const docs = await aiService.generateFlashcards(req.user.id, req.body);
  return res.status(201).json({ count: docs.length, data: docs });
});

module.exports = { generateStudyPlan, generateFlashcards };
