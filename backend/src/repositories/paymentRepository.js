const Payment = require('../models/Payment');

async function create(payload) {
  return Payment.create(payload);
}

async function markVerified(id, metadata = {}) {
  return Payment.findByIdAndUpdate(
    id,
    { status: 'verified', verifiedAt: new Date(), metadata: { ...metadata } },
    { new: true }
  );
}

module.exports = { create, markVerified };
