const { validationMiddleware } = require('../../middleware/validationMiddleware');
const httpMocks = require('node-mocks-http');

describe('Validation Middleware', () => {
  it('should validate required fields', async () => {
    const req = httpMocks.createRequest({
      body: {}
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await validationMiddleware(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res._getData())).toHaveProperty('error');
  });

  it('should validate field formats', async () => {
    const req = httpMocks.createRequest({
      body: {
        email: 'invalid-email'
      }
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await validationMiddleware(req, res, next);
    expect(res.statusCode).toBe(400);
  });

  it('should pass validation with valid data', async () => {
    const req = httpMocks.createRequest({
      body: {
        email: 'test@example.com',
        password: 'validPassword123'
      }
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await validationMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
