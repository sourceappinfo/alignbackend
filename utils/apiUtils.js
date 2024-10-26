// utils/apiUtils.js

/**
 * Wraps an async route handler to catch errors and pass them to the error handler middleware.
 * @param {Function} fn - The async function to wrap
 * @returns {Function} - The wrapped function
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  
  /**
   * Standardize API response format for successful responses.
   * @param {Object} res - Express response object
   * @param {Object} data - The data to return in the response
   * @param {String} message - Optional message to include in the response
   * @param {Number} statusCode - HTTP status code
   */
  const sendResponse = (res, data = {}, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
      status: 'success',
      message,
      data,
    });
  };
  
  module.exports = {
    asyncHandler,
    sendResponse,
  };
  