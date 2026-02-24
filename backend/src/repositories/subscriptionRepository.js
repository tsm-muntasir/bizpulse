const Subscription = require('../models/Subscription');

async function findByUser(userId) {
  return Subscription.findOne({ userId });
}

async function upsertByUser(userId, payload) {
  return Subscription.findOneAndUpdate({ userId }, payload, { upsert: true, new: true });
}

module.exports = { findByUser, upsertByUser };
