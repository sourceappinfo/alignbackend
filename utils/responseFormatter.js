const formatSuccessResponse = (message = 'Success', data = null) => ({
  success: true,
  message,
  data: data || null
});

const formatErrorResponse = (error, statusCode = 500) => ({
  success: false,
  statusCode,
  error
});

module.exports = {
  formatSuccessResponse,
  formatErrorResponse
};
