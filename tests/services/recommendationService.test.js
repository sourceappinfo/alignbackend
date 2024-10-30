const mongoose = require('mongoose');
const RecommendationService = require('../../services/recommendationService');
const Recommendation = require('../../models/Recommendation');

jest.mock('../../models/Recommendation');

describe('Recommendation Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateRecommendations', () => {
    it('should generate recommendations based on user preferences', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockRecommendations = [
        { company: 'company1', score: 0.9 },
        { company: 'company2', score: 0.8 }
      ];

      const mockFind = jest.fn().mockReturnThis();
      const mockPopulate = jest.fn().mockReturnThis();
      const mockSort = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValue(mockRecommendations);

      Recommendation.find = mockFind;
      Recommendation.find().populate = mockPopulate;
      Recommendation.find().populate().sort = mockSort;
      Recommendation.find().populate().sort().exec = mockExec;

      const result = await RecommendationService.generateRecommendations(userId);
      expect(result).toEqual(mockRecommendations);
    });
  });
});
