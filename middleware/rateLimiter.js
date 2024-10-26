// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15') * 60 * 1000, // Default to 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // Default to 100 requests
  message: {
    message: 'Too many requests from this IP, please try again after some time.',
  },
  headers: true,
});

module.exports = rateLimiter;
