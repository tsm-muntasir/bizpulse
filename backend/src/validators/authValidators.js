const Joi = require('joi');

const registerSchema = Joi.object({
  fullName: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  university: Joi.string().valid('IUBAT', 'University of Dhaka', 'North South University').required(),
  password: Joi.string().min(10).max(128).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = { registerSchema, loginSchema };
