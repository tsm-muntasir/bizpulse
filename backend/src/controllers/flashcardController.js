const asyncHandler = require('../utils/asyncHandler');
const flashcardRepo = require('../repositories/flashcardRepository');
const aiService = require('../services/aiService');

const listFlashcards = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 50), 100);
  const subjectId = req.query.subjectId;
  const docs = await flashcardRepo.listByUser(req.user.id, subjectId, page, limit);
  return res.status(200).json({ page, limit, data: docs });
});

const generateFlashcards = asyncHandler(async (req, res) => {
  const docs = await aiService.generateFlashcards(req.user.id, req.body);
  return res.status(201).json({ count: docs.length, data: docs });
});

const deleteFlashcard = asyncHandler(async (req, res) => {
  const Flashcard = require('../models/Flashcard');
  await Flashcard.deleteOne({ _id: req.params.id, userId: req.user.id });
  return res.status(204).send();
});

module.exports = { listFlashcards, generateFlashcards, deleteFlashcard };
