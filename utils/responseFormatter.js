// utils/responseFormatter.js

/**
 * Format successful response
 * @param {Object} data - The data to return
 * @param {String} message - The success message
 * @returns {Object} - Formatted response object
 */
const formatSuccess = (data, message = 'Success') => ({
    status: 'success',
    message,
    data,
  });
  
  /**
   * Format error response
   * @param {String} errorMessage - The error message
   * @param {Number} statusCode - HTTP status code
   * @param {Object} [errors] - Additional error details
   * @returns {Object} - Formatted error response
   */
  const formatError = (errorMessage, statusCode = 400, errors = {}) => ({
    status: 'error',
    message: errorMessage,
    statusCode,
    errors,
  });
  
  module.exports = {
    formatSuccess,
    formatError,
  };
  