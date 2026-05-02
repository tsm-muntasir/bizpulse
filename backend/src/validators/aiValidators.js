const Joi = require('joi');

const generatePlanSchema = Joi.object({
  subjectId: Joi.string().hex().length(24).required(),
  goals: Joi.array().items(Joi.string().max(150)).min(1).required(),
  availableHoursPerWeek: Joi.number().min(1).max(80).required()
});

const generateFlashcardsSchema = Joi.object({
  subjectId: Joi.string().hex().length(24).required(),
  topic: Joi.string().max(150).required(),
  content: Joi.string().max(5000).required(),
  count: Joi.number().integer().min(5).max(50).default(15)
});

const generateQuizSchema = Joi.object({
  subjectId: Joi.string().hex().length(24).required(),
  topic: Joi.string().max(150).required(),
  title: Joi.string().max(200),
  description: Joi.string().max(500),
  count: Joi.number().integer().min(3).max(30).default(10),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium'),
  timeLimitMinutes: Joi.number().integer().min(5).max(180).default(30),
  passingScore: Joi.number().integer().min(0).max(100).default(70)
});

module.exports = { generatePlanSchema, generateFlashcardsSchema, generateQuizSchema };
