const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const csurf = require('csurf');
const pinoHttp = require('pino-http');

const env = require('./config/env');
const logger = require('./config/logger');
const routes = require('./api/v1/routes');
const requestContext = require('./middlewares/requestContext');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(requestContext);
app.use(pinoHttp({ logger, customProps: (req) => ({ requestId: req.requestId }) }));

app.use(
  helmet({
    contentSecurityPolicy: env.isProd
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:']
          }
        }
      : false
  })
);
app.use(compression());
app.use(hpp());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(
  express.json({
    limit: '1mb',
    verify: (req, _res, buf) => {
      req.rawBody = buf.toString('utf8');
    }
  })
);
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (env.corsOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('CORS blocked'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  })
);

const csrfProtection = csurf({ cookie: { httpOnly: true, sameSite: 'lax', secure: env.isProd } });
app.use((req, res, next) => {
  const skipCsrf = req.path === '/api/v1/payments/stripe/webhook' || req.path.startsWith('/api/v1/auth/');
  if (skipCsrf || ['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  return csrfProtection(req, res, next);
});

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
