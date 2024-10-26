const errorHandler = require('../../middleware/errorHandler');

describe('Error Handler Middleware', () => {
  it('should return a formatted error response', () => {
    const err = new Error('Test error');
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Test error',
      message: 'An unexpected error occurred.',
    });
  });
});
