const express = require('express');
const authenticate = require('../../../middlewares/authenticate');
const paymentController = require('../../../controllers/paymentController');

const router = express.Router();

router.post('/stripe/webhook', paymentController.verifyStripeWebhook);
router.post('/bkash/verify', authenticate, paymentController.verifyBkash);
router.post('/nagad/verify', authenticate, paymentController.verifyNagad);

module.exports = router;
