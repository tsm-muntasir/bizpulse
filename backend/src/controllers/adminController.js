const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const listUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 20), 100);
  const skip = (page - 1) * limit;

  const users = await User.find({}).select('-passwordHash').skip(skip).limit(limit).sort({ createdAt: -1 });
  return res.status(200).json({ page, limit, data: users });
});

module.exports = { listUsers };
