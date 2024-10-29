const authMiddleware = require('../../middleware/authMiddleware');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');

describe('Auth Middleware', () => {
  it('should call next function if token is valid', () => {
    const token = jwt.sign({ userId: 'user123' }, process.env.JWT_SECRET);
    const req = httpMocks.createRequest({
      headers: {
        authorization: 'Bearer ' + token
      }
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should handle missing authorization header', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);
    expect(res.statusCode).toBe(401);
  });

  it('should handle malformed token', () => {
    const req = httpMocks.createRequest({
      headers: {
        authorization: 'malformed-token'
      }
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);
    expect(res.statusCode).toBe(401);
  });

  it('should handle invalid token', () => {
    const req = httpMocks.createRequest({
      headers: {
        authorization: 'Bearer invalid.token.here'
      }
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);
    expect(res.statusCode).toBe(401);
  });
});
