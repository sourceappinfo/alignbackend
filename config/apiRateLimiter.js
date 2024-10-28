const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// Configure API rate limiter
const apiRateLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000 || 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: {
    status: 429,
    error: 'Too many requests. Please try again later.',
  },
  headers: true,
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).json({
      status: 'fail',
      message: options.message.error,
      retryAfter: Math.ceil(options.windowMs / 1000 / 60),
    });
  },
  keyGenerator: (req) => req.ip,
});

module.exports = apiRateLimiter;
