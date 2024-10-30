const request = require('supertest');
const express = require('express');
const recommendationRoutes = require('../../controllers/recommendationController');
const recommendationService = require('../../services/recommendationService');

jest.mock('../../services/recommendationService');
jest.mock('../../middleware/authMiddleware', () => (req, res, next) => {
  req.user = { userId: 'testUser' };
  next();
});

const app = express();
app.use(express.json());
app.use('/api/recommendations', recommendationRoutes);

describe('Recommendation Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('should get recommendations successfully', async () => {
      const mockRecommendations = [
        { companyId: 'company1', score: 0.9 },
        { companyId: 'company2', score: 0.8 }
      ];
      
      recommendationService.generateRecommendations.mockResolvedValue(mockRecommendations);

      const response = await request(app)
        .get('/api/recommendations')
        .query({ criteria: { industry: 'Tech' } });

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toEqual(mockRecommendations);
    });

    it('should handle recommendation errors', async () => {
      recommendationService.generateRecommendations
        .mockRejectedValue(new Error('Service error'));

      const response = await request(app)
        .get('/api/recommendations');

      expect(response.statusCode).toBe(500);
      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /', () => {
    it('should save recommendation successfully', async () => {
      const mockRecommendation = {
        userId: 'testUser',
        companyId: 'company1',
        score: 85
      };
      
      recommendationService.saveRecommendation.mockResolvedValue(mockRecommendation);

      const response = await request(app)
        .post('/api/recommendations')
        .send({ companyId: 'company1', score: 85 });

      expect(response.statusCode).toBe(201);
      expect(response.body.data).toEqual(mockRecommendation);
    });

    it('should handle save errors', async () => {
      recommendationService.saveRecommendation
        .mockRejectedValue(new Error('Save error'));

      const response = await request(app)
        .post('/api/recommendations')
        .send({ companyId: 'company1', score: 85 });

      expect(response.statusCode).toBe(500);
      expect(response.body.status).toBe('error');
    });
  });

  // For compatibility with existing tests
  it('should have a defined recommendation function', () => {
    expect(typeof recommendationRoutes.someFunction).toBe('function');
  });
});