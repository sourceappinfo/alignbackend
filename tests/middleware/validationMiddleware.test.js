const validationMiddleware = require('../../middleware/validationMiddleware');
const { check, validationResult } = require('express-validator');

describe('Validation Middleware', () => {
  it('should call next if there are no validation errors', () => {
    const req = { body: { email: 'test@example.com' } };
    const res = {};
    const next = jest.fn();

    validationMiddleware([check('email').isEmail()])(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return errors if validation fails', () => {
    const req = { body: { email: 'invalid-email' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    validationMiddleware([check('email').isEmail()])(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.any(Array),
    });
  });
});
