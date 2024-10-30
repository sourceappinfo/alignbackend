const { formatSuccessResponse, formatErrorResponse } = require('../../utils/responseFormatter');

describe('Response Formatter', () => {
  it('should format a success response', () => {
    const message = 'Test success';
    const data = { id: 1 };
    const response = formatSuccessResponse(message, data);

    expect(response).toEqual({
      success: true,
      message,
      data
    });
  });

  it('should format an error response', () => {
    const error = 'Test error';
    const statusCode = 400;
    const response = formatErrorResponse(error, statusCode);

    expect(response).toEqual({
      success: false,
      statusCode,
      error
    });
  });

  it('should handle success response without data', () => {
    const message = 'Test success';
    const response = formatSuccessResponse(message);

    expect(response).toEqual({
      success: true,
      message,
      data: null
    });
  });

  it('should handle error response without status code', () => {
    const error = 'Test error';
    const response = formatErrorResponse(error);

    expect(response).toEqual({
      success: false,
      statusCode: 500,
      error
    });
  });
});