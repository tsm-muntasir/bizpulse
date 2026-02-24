const ActivityLog = require('../models/ActivityLog');

async function create(payload) {
  return ActivityLog.create(payload);
}

module.exports = { create };
