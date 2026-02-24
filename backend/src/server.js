const http = require('http');
const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const { connectDB } = require('./config/db');

async function bootstrap() {
  await connectDB();

  const server = http.createServer(app);
  server.listen(env.port, () => {
    logger.info(`API running on port ${env.port}`);
  });

  const shutdown = async (signal) => {
    logger.info(`${signal} received, shutting down`);
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  logger.error({ err }, 'Failed to start server');
  process.exit(1);
});
