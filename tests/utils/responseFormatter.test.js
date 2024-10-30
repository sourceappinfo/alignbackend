const formatSuccessResponse = (message, data = null) => ({
  status: 'success',
  message,
  data
});

const formatErrorResponse = (message, error = null) => ({
  status: 'error',
  message,
  error
});

module.exports = {
  formatSuccessResponse,
  formatErrorResponse
};