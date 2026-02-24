const ApiError = require('../utils/ApiError');

module.exports = function authorizeRoles(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden'));
    }
    return next();
  };
};
