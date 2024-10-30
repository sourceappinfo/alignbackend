const mongoose = require('mongoose');
const Recommendation = require('../../models/Recommendation');

describe('Recommendation Model', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new recommendation', async () => {
    const mockData = {
      user: new mongoose.Types.ObjectId(),
      company: new mongoose.Types.ObjectId(),
      score: 85
    };

    const recommendation = new Recommendation(mockData);
    await recommendation.save();

    const foundRecommendation = await Recommendation.findOne({ score: 85 });
    expect(foundRecommendation).toBeTruthy();
    expect(foundRecommendation.score).toBe(85);
  });
});