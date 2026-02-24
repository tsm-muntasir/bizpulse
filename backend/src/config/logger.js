const pino = require('pino');
const env = require('./env');

const logger = pino({
  level: env.isProd ? 'info' : 'debug',
  redact: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.token']
});

module.exports = logger;
