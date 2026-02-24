const logger = require('../config/logger');

module.exports = function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || 500;
  logger.error({ err }, 'Request failed');

  return res.status(status).json({
    message: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR',
    details: err.details || undefined
  });
};
