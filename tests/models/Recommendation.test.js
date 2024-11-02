// tests/models/Recommendation.test.js

const mongoose = require('mongoose');
const Recommendation = require('../../models/Recommendation');

describe('Recommendation Model', () => {
  describe('Creation and Validation', () => {
    it('should create a new recommendation with valid data', async () => {
      const validRecommendation = {
        userId: new mongoose.Types.ObjectId(),
        companyId: new mongoose.Types.ObjectId(),
        score: 85
      };

      const recommendation = new Recommendation(validRecommendation);
      const savedRecommendation = await recommendation.save();

      expect(savedRecommendation._id).toBeDefined();
      expect(savedRecommendation.userId.toString()).toBe(validRecommendation.userId.toString());
      expect(savedRecommendation.companyId.toString()).toBe(validRecommendation.companyId.toString());
      expect(savedRecommendation.score).toBe(validRecommendation.score);
    });

    it('should fail to create recommendation without required fields', async () => {
      const invalidRecommendation = new Recommendation({});

      let error;
      try {
        await invalidRecommendation.validate();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.errors.userId).toBeDefined();
      expect(error.errors.companyId).toBeDefined();
      expect(error.errors.score).toBeDefined();
    });

    it('should enforce minimum score', async () => {
      const recommendation = new Recommendation({
        userId: new mongoose.Types.ObjectId(),
        companyId: new mongoose.Types.ObjectId(),
        score: -1
      });

      let error;
      try {
        await recommendation.validate();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.errors.score).toBeDefined();
    });
  });

  describe('Timestamps', () => {
    it('should create timestamps on save', async () => {
      const recommendation = new Recommendation({
        userId: new mongoose.Types.ObjectId(),
        companyId: new mongoose.Types.ObjectId(),
        score: 85
      });

      const savedRecommendation = await recommendation.save();

      expect(savedRecommendation.createdAt).toBeDefined();
      expect(savedRecommendation.updatedAt).toBeDefined();
      expect(savedRecommendation.createdAt).toBeInstanceOf(Date);
      expect(savedRecommendation.updatedAt).toBeInstanceOf(Date);
    });
  });
});