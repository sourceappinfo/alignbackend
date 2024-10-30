// utils/responseFormatter.js

const formatSuccessResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data,
});

const formatErrorResponse = (error, statusCode = 500) => ({
  success: false,
  statusCode,
  error,
});

module.exports = {
  formatSuccessResponse,
  formatErrorResponse,
};
