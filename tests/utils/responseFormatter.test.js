const { formatSuccessResponse, formatErrorResponse } = require('../../utils/responseFormatter');

describe('Response Formatter', () => {
  describe('Success Response', () => {
    it('should format a success response with both message and data', () => {
      const message = 'Test success';
      const data = { id: 1 };
      const response = formatSuccessResponse(message, data);

      expect(response).toEqual({
        success: true,
        message: message,
        data: data
      });
    });

    it('should format a success response with only message', () => {
      const message = 'Test success';
      const response = formatSuccessResponse(message);

      expect(response).toEqual({
        success: true,
        message: message,
        data: null
      });
    });

    it('should handle null data explicitly', () => {
      const message = 'Test success';
      const data = null;
      const response = formatSuccessResponse(message, data);

      expect(response).toEqual({
        success: true,
        message: message,
        data: null
      });
    });

    it('should handle undefined data', () => {
      const message = 'Test success';
      const response = formatSuccessResponse(message, undefined);

      expect(response).toEqual({
        success: true,
        message: message,
        data: null
      });
    });
  });

  describe('Error Response', () => {
    it('should format an error response with status code', () => {
      const error = 'Test error';
      const statusCode = 400;
      const response = formatErrorResponse(error, statusCode);

      expect(response).toEqual({
        success: false,
        statusCode: statusCode,
        error: error
      });
    });

    it('should format an error response with default status code', () => {
      const error = 'Test error';
      const response = formatErrorResponse(error);

      expect(response).toEqual({
        success: false,
        statusCode: 500,
        error: error
      });
    });

    it('should handle error objects', () => {
      const error = new Error('Test error');
      const response = formatErrorResponse(error.message);

      expect(response).toEqual({
        success: false,
        statusCode: 500,
        error: 'Test error'
      });
    });
  });
});