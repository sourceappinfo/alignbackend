// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const { formatErrorResponse } = require('../utils/responseFormatter');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: formatErrorResponse('Too many requests, please try again later'),
  handler: (req, res) => {
    res.status(429).json(formatErrorResponse('Too many requests, please try again later'));
  },
});

module.exports = rateLimiter;
