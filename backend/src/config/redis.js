const Redis = require('ioredis');
const env = require('./env');
const logger = require('./logger');

let redisClient;

function getRedisClient() {
  if (!env.redisUrl) return null;
  if (!redisClient) {
    redisClient = new Redis(env.redisUrl, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
      lazyConnect: true
    });
    redisClient.on('error', (err) => logger.error({ err }, 'Redis error'));
  }
  return redisClient;
}

module.exports = { getRedisClient };
