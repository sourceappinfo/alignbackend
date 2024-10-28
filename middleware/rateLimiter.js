// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15') * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests, please try again later.',
  headers: true,
});

module.exports = rateLimiter;
