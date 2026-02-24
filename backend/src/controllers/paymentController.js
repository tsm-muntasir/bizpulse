const asyncHandler = require('../utils/asyncHandler');
const paymentService = require('../services/paymentService');

const verifyStripeWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  await paymentService.verifyStripePayment({
    paymentId: req.body.paymentId,
    userId: req.body.userId,
    rawBody: req.rawBody,
    signature
  });

  return res.status(200).json({ ok: true });
});

const verifyBkash = asyncHandler(async (req, res) => {
  await paymentService.verifyBkashPayment({
    paymentId: req.body.paymentId,
    trxId: req.body.trxId,
    amount: req.body.amount,
    userId: req.user.id
  });
  return res.status(200).json({ ok: true });
});

const verifyNagad = asyncHandler(async (req, res) => {
  await paymentService.verifyNagadPayment({
    paymentId: req.body.paymentId,
    reference: req.body.reference,
    amount: req.body.amount,
    userId: req.user.id
  });
  return res.status(200).json({ ok: true });
});

module.exports = { verifyStripeWebhook, verifyBkash, verifyNagad };
