const errorHandler = require('../../middleware/errorHandler');
const { formatErrorResponse } = require('../../utils/responseFormatter');

describe('Error Handler Middleware', () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(), // Allows chaining
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('should return a formatted error response', () => {
    const error = new Error('Test error');
    error.statusCode = 400;

    errorHandler(error, mockRequest, mockResponse, nextFunction);

    // Assert that status 400 is set
    expect(mockResponse.status).toHaveBeenCalledWith(400);

    // Assert that json response is called with the formatted error message
    expect(mockResponse.json).toHaveBeenCalledWith(
      formatErrorResponse('Test error')
    );
  });

  it('should default to 500 if no statusCode is provided', () => {
    const error = new Error('Test error');

    errorHandler(error, mockRequest, mockResponse, nextFunction);

    // Expect default status to be 500 if no statusCode is specified
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      formatErrorResponse('Test error')
    );
  });
});
