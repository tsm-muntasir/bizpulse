const rateLimit = require('express-rate-limit');
const { getRedisClient } = require('../config/redis');

function memoryLimiter(windowMs, limit, message) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message }
  });
}

function redisLimiter(prefix, windowSec, limit) {
  return async (req, res, next) => {
    try {
      const redis = getRedisClient();
      if (!redis) return next();

      if (redis.status === 'wait') await redis.connect();

      const key = `${prefix}:${req.ip}`;
      const current = await redis.incr(key);
      if (current === 1) await redis.expire(key, windowSec);

      if (current > limit) {
        return res.status(429).json({ message: 'Too many requests. Try again later.' });
      }
      return next();
    } catch (_err) {
      return next();
    }
  };
}

const loginRateLimiter = [redisLimiter('login', 15 * 60, 20), memoryLimiter(15 * 60 * 1000, 20, 'Too many login attempts')];
const aiRateLimiter = [redisLimiter('ai', 60, 20), memoryLimiter(60 * 1000, 20, 'AI rate limit exceeded')];

module.exports = { loginRateLimiter, aiRateLimiter };
