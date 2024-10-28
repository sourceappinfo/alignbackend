// middleware/errorHandler.js
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack || err.message);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation Error', details: err.message });
  }

  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message,
  });
};

module.exports = errorHandler;
