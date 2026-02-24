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

module.exports = { generatePlanSchema, generateFlashcardsSchema };
