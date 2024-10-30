const request = require('supertest');
const express = require('express');
const rateLimiter = require('../../middleware/rateLimiter');

describe('Rate Limiter Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(rateLimiter);
    app.get('/test', (req, res) => res.json({ message: 'success' }));
  });

  it('should allow requests within limit', async () => {
    const response = await request(app).get('/test');
    expect(response.status).toBe(200);
  });

  it('should block requests over limit', async () => {
    // Make 101 requests
    const requests = Array(101).fill().map(() => request(app).get('/test'));
    const responses = await Promise.all(requests);
    
    // The last request should be blocked
    expect(responses[100].status).toBe(429);
  });
});
