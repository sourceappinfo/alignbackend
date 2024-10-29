const recommendationService = require('../../services/recommendationService');
const Recommendation = require('../../models/Recommendation');

jest.mock('../../models/Recommendation');

describe('Recommendation Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate recommendations based on user preferences', async () => {
    const userId = 'user123';
    const mockRecommendations = [
      { company: 'company1', score: 0.9 },
      { company: 'company2', score: 0.8 }
    ];

    Recommendation.find.mockResolvedValue(mockRecommendations);

    const result = await recommendationService.generateRecommendations(userId);
    expect(result).toEqual(mockRecommendations);
  });

  it('should filter recommendations by criteria', async () => {
    const userId = 'user123';
    const criteria = { industry: 'Tech', size: 'Large' };
    const mockRecommendations = [
      { company: 'company1', industry: 'Tech', size: 'Large', score: 0.9 }
    ];

    Recommendation.find.mockResolvedValue(mockRecommendations);

    const result = await recommendationService.generateRecommendations(userId, criteria);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ industry: 'Tech' })
      ])
    );
  });

  it('should handle empty preference data', async () => {
    const userId = 'user123';
    Recommendation.find.mockResolvedValue([]);

    const result = await recommendationService.generateRecommendations(userId);
    expect(result).toHaveLength(0);
  });

  it('should handle recommendation generation errors', async () => {
    const userId = 'user123';
    Recommendation.find.mockRejectedValue(new Error('DB Error'));

    await expect(
      recommendationService.generateRecommendations(userId)
    ).rejects.toThrow('DB Error');
  });
});

// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';

  res.status(statusCode).json({
    status: 'error',
    message: message
  });
};

module.exports = errorHandler;