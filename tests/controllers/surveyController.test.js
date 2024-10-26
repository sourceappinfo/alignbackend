const request = require('supertest');
const app = require('../../server');
const Survey = require('../../models/Survey');
const { connectDB, disconnectDB } = require('../../config/db');

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe('Survey Controller', () => {
  it('should retrieve survey questions', async () => {
    const res = await request(app).get('/api/survey/questions');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('questions');
  });

  it('should submit survey responses', async () => {
    const res = await request(app).post('/api/survey/submit').send({
      responses: { question1: 'Answer 1', question2: 'Answer 2' },
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Responses submitted successfully');
  });
});
