const asyncHandler = require('../utils/asyncHandler');
const progressService = require('../services/progressService');

const getDashboard = asyncHandler(async (req, res) => {
  const data = await progressService.getDashboard(req.user.id);
  return res.status(200).json(data);
});

module.exports = { getDashboard };
