const Progress = require('../models/Progress');

async function upsertDaily(userId, subjectId, date, payload) {
  return Progress.findOneAndUpdate(
    { userId, subjectId, date },
    payload,
    { upsert: true, new: true }
  );
}

async function dashboardByUser(userId, days = 30) {
  const from = new Date();
  from.setDate(from.getDate() - days);
  return Progress.find({ userId, date: { $gte: from } }).sort({ date: 1 });
}

module.exports = { upsertDaily, dashboardByUser };
