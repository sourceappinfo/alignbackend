// tests/controllers/recommendationController.test.js
const recommendationController = require('../../controllers/recommendationController');
const recommendationService = require('../../services/recommendationService');

jest.mock('../../services/recommendationService');
jest.mock('../../utils/responseFormatter', () => ({
  formatSuccessResponse: jest.fn().mockImplementation((data, message) => ({
    status: 'success',
    data,
    message
  })),
  formatErrorResponse: jest.fn().mockImplementation((message) => ({
    status: 'error',
    message
  }))
}));

describe('Recommendation Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have a defined recommendation function', () => {
    expect(typeof recommendationController.someFunction).toBe('function');
  });

  describe('Generate Recommendations', () => {
    it('should generate recommendations successfully', async () => {
      const mockRecommendations = [
        { companyId: 'company1', score: 0.9 },
        { companyId: 'company2', score: 0.8 }
      ];
      
      recommendationService.generateRecommendations.mockResolvedValue(mockRecommendations);

      const req = {
        user: { userId: 'testUser' },
        query: { criteria: { industry: 'Tech' } }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await recommendationController.generateRecommendations(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    it('should handle recommendation generation errors', async () => {
      const req = {
        user: { userId: 'testUser' },
        query: {}
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      recommendationService.generateRecommendations
        .mockRejectedValue(new Error('Service error'));

      await recommendationController.generateRecommendations(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('Save Recommendation', () => {
    it('should save recommendation successfully', async () => {
      const mockRecommendation = {
        userId: 'testUser',
        companyId: 'company1',
        score: 85
      };
      
      recommendationService.saveRecommendation.mockResolvedValue(mockRecommendation);

      const req = {
        user: { userId: 'testUser' },
        body: { companyId: 'company1', score: 85 }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await recommendationController.saveRecommendation(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });
  });
});