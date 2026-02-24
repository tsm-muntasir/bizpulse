const mongoose = require('mongoose');
const plans = require('../constants/subscriptionPlans');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    plan: { type: String, enum: [plans.FREE, plans.PREMIUM], default: plans.FREE, index: true },
    status: { type: String, enum: ['active', 'inactive', 'past_due', 'canceled'], default: 'active' },
    provider: { type: String, enum: ['stripe', 'bkash', 'nagad', 'none'], default: 'none' },
    providerCustomerId: { type: String },
    providerSubscriptionId: { type: String },
    startsAt: { type: Date, default: Date.now },
    endsAt: { type: Date },
    aiQuotaPerMonth: { type: Number, default: 40 },
    aiCallsUsedThisMonth: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
