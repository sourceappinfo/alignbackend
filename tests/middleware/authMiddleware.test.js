const { authMiddleware } = require('../../middleware/authMiddleware');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');

describe('Auth Middleware', () => {
  it('should call next if token is valid', () => {
    const req = httpMocks.createRequest({
      headers: {
        authorization: 'Bearer valid-token',
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    jwt.verify = jest.fn().mockReturnValue({ id: 'userId' });
    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    const req = httpMocks.createRequest({
      headers: {
        authorization: 'Bearer invalid-token',
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    jwt.verify = jest.fn(() => { throw new Error('Invalid token'); });
    authMiddleware(req, res, next);

    expect(res.statusCode).toBe(401);
  });
});
