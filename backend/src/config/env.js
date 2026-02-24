const dotenv = require('dotenv');

dotenv.config();

const required = [
  'NODE_ENV',
  'PORT',
  'MONGO_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'BCRYPT_SALT_ROUNDS'
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

module.exports = {
  nodeEnv: process.env.NODE_ENV,
  isProd: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT || 8080),
  mongoUri: process.env.MONGO_URI,
  redisUrl: process.env.REDIS_URL,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTtl: process.env.JWT_ACCESS_TTL || '15m',
    refreshTtl: process.env.JWT_REFRESH_TTL || '7d'
  },
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 12),
  cookieDomain: process.env.COOKIE_DOMAIN,
  corsOrigins: (process.env.CORS_ORIGINS || '').split(',').filter(Boolean),
  ai: {
    provider: process.env.AI_PROVIDER,
    apiKey: process.env.AI_API_KEY
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  },
  bkash: {
    appKey: process.env.BKASH_APP_KEY,
    appSecret: process.env.BKASH_APP_SECRET,
    username: process.env.BKASH_USERNAME,
    password: process.env.BKASH_PASSWORD
  },
  nagad: {
    merchantId: process.env.NAGAD_MERCHANT_ID,
    apiKey: process.env.NAGAD_API_KEY
  }
};
