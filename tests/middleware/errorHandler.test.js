const errorHandler = require('../../middleware/errorHandler');
const { formatErrorResponse } = require('../../utils/responseFormatter');

describe('Error Handler Middleware', () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('should handle error with status code', () => {
    const error = new Error('Test error');
    error.statusCode = 400;

    errorHandler(error, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      formatErrorResponse(error.message)
    );
  });

  it('should handle error without status code', () => {
    const error = new Error('Internal server error');

    errorHandler(error, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      formatErrorResponse('An unexpected error occurred')
    );
  });
});