const { ValidationError, NotFoundError, AuthenticationError } = require('../../utils/errorTypes');

describe('Error Types', () => {
  it('should create a validation error', () => {
    const error = new ValidationError('Validation failed');
    expect(error.message).toBe('Validation failed');
    expect(error.statusCode).toBe(400);
  });

  it('should create a not found error', () => {
    const error = new NotFoundError('Not found');
    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
  });

  it('should create an authentication error', () => {
    const error = new AuthenticationError('Authentication failed');
    expect(error.message).toBe('Authentication failed');
    expect(error.statusCode).toBe(401);
  });
});
