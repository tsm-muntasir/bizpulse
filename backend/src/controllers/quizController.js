const asyncHandler = require('../utils/asyncHandler');
const quizRepo = require('../repositories/quizRepository');
const quizService = require('../services/quizService');

const listQuizzes = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 20), 100);
  const subjectId = req.query.subjectId;
  const docs = await quizRepo.listByUser(req.user.id, subjectId, page, limit);
  return res.status(200).json({ page, limit, data: docs });
});

const getQuiz = asyncHandler(async (req, res) => {
  const doc = await quizRepo.findById(req.params.id, req.user.id);
  if (!doc) {
    return res.status(404).json({ message: 'Quiz not found' });
  }
  return res.status(200).json(doc);
});

const takeQuiz = asyncHandler(async (req, res) => {
  const { answers } = req.body;
  const result = await quizService.takeQuiz(req.params.id, req.user.id, answers);
  return res.status(200).json(result);
});

const deleteQuiz = asyncHandler(async (req, res) => {
  await quizRepo.deleteById(req.params.id, req.user.id);
  return res.status(204).send();
});

module.exports = { listQuizzes, getQuiz, takeQuiz, deleteQuiz };
