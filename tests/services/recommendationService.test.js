const recommendationService = require('../../services/recommendationService');

describe('Recommendation Service', () => {
  it('should generate recommendations based on user preferences', async () => {
    const recommendations = await recommendationService.generateRecommendations('user123');
    expect(Array.isArray(recommendations)).toBe(true);
  });
});
