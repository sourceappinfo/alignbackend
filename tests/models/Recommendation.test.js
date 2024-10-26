const Recommendation = require('../../models/Recommendation');

describe('Recommendation Model', () => {
  it('should create a new recommendation', async () => {
    const recommendation = new Recommendation({
      userId: 'user123',
      companyId: 'company123',
      score: 85,
    });
    await recommendation.save();

    const foundRecommendation = await Recommendation.findOne({ score: 85 });
    expect(foundRecommendation).toBeTruthy();
  });
});
