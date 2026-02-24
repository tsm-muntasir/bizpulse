const mongoose = require('mongoose');
const env = require('./env');
const logger = require('./logger');

async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri, {
    autoIndex: !env.isProd,
    maxPoolSize: 50,
    minPoolSize: 5,
    connectTimeoutMS: 10000
  });
  logger.info('MongoDB connected');
}

module.exports = { connectDB };
