// tests/controllers/authController.test.js
const request = require('supertest');
const app = require('../../app'); // Assuming you have an express app in app.js

describe('AuthController', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
  });

  it('should login with valid credentials', async () => {
    await request(app).post('/auth/register').send({ email: 'test@example.com', password: 'password123' });
    const res = await request(app).post('/auth/login').send({ email: 'test@example.com', password: 'password123' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });
});
