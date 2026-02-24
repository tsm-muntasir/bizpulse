const Joi = require('joi');

const createSubjectSchema = Joi.object({
  name: Joi.string().max(100).required(),
  code: Joi.string().max(30).allow('').optional(),
  examDate: Joi.date().iso().required(),
  weeklyTargetHours: Joi.number().integer().min(1).max(60).optional()
});

module.exports = { createSubjectSchema };
