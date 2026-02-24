const express = require('express');
const validate = require('../../../middlewares/validate');
const { registerSchema, loginSchema } = require('../../../validators/authValidators');
const { loginRateLimiter } = require('../../../middlewares/rateLimiters');
const authController = require('../../../controllers/authController');

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', loginRateLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/csrf-token', authController.csrfToken);

module.exports = router;
