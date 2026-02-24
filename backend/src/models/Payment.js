const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true, index: true },
    provider: { type: String, enum: ['stripe', 'bkash', 'nagad'], required: true, index: true },
    providerPaymentId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'BDT' },
    status: { type: String, enum: ['initiated', 'verified', 'failed', 'refunded'], required: true, index: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    verifiedAt: { type: Date }
  },
  { timestamps: true }
);

paymentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
