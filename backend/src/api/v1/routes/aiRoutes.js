const express = require('express');
const authenticate = require('../../../middlewares/authenticate');
const validate = require('../../../middlewares/validate');
const { aiRateLimiter } = require('../../../middlewares/rateLimiters');
const { generatePlanSchema, generateFlashcardsSchema } = require('../../../validators/aiValidators');
const aiController = require('../../../controllers/aiController');

const router = express.Router();

router.use(authenticate);
router.post('/study-plans', aiRateLimiter, validate(generatePlanSchema), aiController.generateStudyPlan);
router.post('/flashcards', aiRateLimiter, validate(generateFlashcardsSchema), aiController.generateFlashcards);

module.exports = router;
