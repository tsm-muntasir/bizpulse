const crypto = require('crypto');
const env = require('../config/env');
const paymentRepo = require('../repositories/paymentRepository');
const subscriptionRepo = require('../repositories/subscriptionRepository');
const subscriptionService = require('./subscriptionService');

async function createInitiatedPayment(userId, subscriptionId, provider, providerPaymentId, amount) {
  return paymentRepo.create({
    userId,
    subscriptionId,
    provider,
    providerPaymentId,
    amount,
    status: 'initiated'
  });
}

function verifyStripeSignature(rawBody, signatureHeader) {
  const expected = crypto
    .createHmac('sha256', env.stripe.webhookSecret)
    .update(rawBody)
    .digest('hex');

  const expectedBuffer = Buffer.from(expected);
  const incomingBuffer = Buffer.from(signatureHeader || '');
  if (expectedBuffer.length !== incomingBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, incomingBuffer);
}

async function verifyStripePayment({ paymentId, userId, rawBody, signature }) {
  if (!verifyStripeSignature(rawBody, signature)) {
    const error = new Error('Invalid Stripe webhook signature');
    error.statusCode = 401;
    throw error;
  }

  const subscription = await subscriptionService.getOrCreateSubscription(userId);
  await paymentRepo.markVerified(paymentId, { providerEventValidated: true });

  const quota = subscriptionService.getPlanQuota('premium');
  await subscriptionRepo.upsertByUser(userId, {
    userId,
    plan: 'premium',
    status: 'active',
    provider: 'stripe',
    aiQuotaPerMonth: quota.aiQuotaPerMonth
  });

  return { ok: true };
}

async function verifyBkashPayment({ paymentId, trxId, amount, userId }) {
  if (!trxId || !amount) {
    const error = new Error('Missing bKash transaction data');
    error.statusCode = 400;
    throw error;
  }

  await paymentRepo.markVerified(paymentId, { trxId, amount, providerVerifiedServerSide: true });
  const quota = subscriptionService.getPlanQuota('premium');
  await subscriptionRepo.upsertByUser(userId, { userId, plan: 'premium', status: 'active', provider: 'bkash', aiQuotaPerMonth: quota.aiQuotaPerMonth });

  return { ok: true };
}

async function verifyNagadPayment({ paymentId, reference, amount, userId }) {
  if (!reference || !amount) {
    const error = new Error('Missing Nagad verification data');
    error.statusCode = 400;
    throw error;
  }

  await paymentRepo.markVerified(paymentId, { reference, amount, providerVerifiedServerSide: true });
  const quota = subscriptionService.getPlanQuota('premium');
  await subscriptionRepo.upsertByUser(userId, { userId, plan: 'premium', status: 'active', provider: 'nagad', aiQuotaPerMonth: quota.aiQuotaPerMonth });

  return { ok: true };
}

module.exports = {
  createInitiatedPayment,
  verifyStripePayment,
  verifyBkashPayment,
  verifyNagadPayment
};
