const jwt = require('jsonwebtoken');
const authMiddleware = require('../../middleware/authMiddleware');
const { formatErrorResponse } = require('../../utils/responseFormatter');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 401 if no token provided', () => {
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      formatErrorResponse('Unauthorized: No token provided')
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should continue if valid token provided', () => {
    const token = jwt.sign({ userId: 'testUser' }, process.env.JWT_SECRET);
    req.headers.authorization = `Bearer ${token}`;

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
  });

  it('should return 401 for invalid token', () => {
    req.headers.authorization = 'Bearer invalid-token';

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      formatErrorResponse('Unauthorized: Invalid token')
    );
  });

  it('should refresh token if near expiration', () => {
    const token = jwt.sign(
      { userId: 'testUser' },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    );
    req.headers.authorization = `Bearer ${token}`;

    authMiddleware(req, res, next);

    expect(req.newToken).toBeDefined();
    expect(next).toHaveBeenCalled();
  });
});
