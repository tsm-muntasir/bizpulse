const plans = require('../constants/subscriptionPlans');
const subscriptionRepo = require('../repositories/subscriptionRepository');

async function getOrCreateSubscription(userId) {
  let subscription = await subscriptionRepo.findByUser(userId);
  if (!subscription) {
    subscription = await subscriptionRepo.upsertByUser(userId, {
      userId,
      plan: plans.FREE,
      status: 'active',
      provider: 'none',
      aiQuotaPerMonth: 40,
      aiCallsUsedThisMonth: 0
    });
  }
  return subscription;
}

function getPlanQuota(plan) {
  if (plan === plans.PREMIUM) {
    return { aiQuotaPerMonth: 1000 };
  }
  return { aiQuotaPerMonth: 40 };
}

async function consumeAiQuota(userId) {
  const subscription = await getOrCreateSubscription(userId);
  if (subscription.aiCallsUsedThisMonth >= subscription.aiQuotaPerMonth) {
    const error = new Error('AI quota exceeded for current billing cycle');
    error.statusCode = 403;
    throw error;
  }

  subscription.aiCallsUsedThisMonth += 1;
  await subscription.save();
  return subscription;
}

module.exports = { getOrCreateSubscription, getPlanQuota, consumeAiQuota };
