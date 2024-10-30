// middleware/errorHandler.js
const { formatErrorResponse } = require('../utils/responseFormatter');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`Error encountered: ${err.message}`);

  if (err.statusCode) {
    return res.status(err.statusCode).json(formatErrorResponse(err.message));
  }

  res.status(500).json(formatErrorResponse('An unexpected error occurred'));
};

module.exports = errorHandler;
