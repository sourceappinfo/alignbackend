const Recommendation = require('../models/Recommendation');
const cacheService = require('./cacheService');
const logger = require('../utils/logger');

class RecommendationService {
  static async generateRecommendations(userId, criteria = {}) {
    try {
      const cacheKey = `recommendations:${userId}:${JSON.stringify(criteria)}`;
      const cachedRecommendations = await cacheService.get(cacheKey);

      if (cachedRecommendations) {
        return cachedRecommendations;
      }

      const query = { userId, ...criteria };
      const recommendations = await Recommendation.find(query)
        .populate('companyId')
        .sort({ score: -1 })
        .lean();

      await cacheService.set(cacheKey, recommendations, 3600); // Cache for 1 hour
      return recommendations;
    } catch (error) {
      logger.error(`Failed to generate recommendations: ${error.message}`);
      throw new Error(`Failed to generate recommendations: ${error.message}`);
    }
  }

  static async saveRecommendation(userId, companyId, score) {
    try {
      const recommendation = await Recommendation.create({
        userId,
        companyId,
        score
      });

      // Invalidate cache for this user
      const cachePattern = `recommendations:${userId}:*`;
      await cacheService.clear(cachePattern);

      return recommendation;
    } catch (error) {
      logger.error(`Failed to save recommendation: ${error.message}`);
      throw new Error(`Failed to save recommendation: ${error.message}`);
    }
  }

  static async updateRecommendation(recommendationId, score) {
    try {
      const recommendation = await Recommendation.findByIdAndUpdate(
        recommendationId,
        { score },
        { new: true, runValidators: true }
      );

      if (!recommendation) {
        throw new Error('Recommendation not found');
      }

      // Invalidate cache for this user
      const cachePattern = `recommendations:${recommendation.userId}:*`;
      await cacheService.clear(cachePattern);

      return recommendation;
    } catch (error) {
      logger.error(`Failed to update recommendation: ${error.message}`);
      throw new Error(`Failed to update recommendation: ${error.message}`);
    }
  }

  static async deleteRecommendation(recommendationId) {
    try {
      const recommendation = await Recommendation.findByIdAndDelete(recommendationId);

      if (!recommendation) {
        throw new Error('Recommendation not found');
      }

      // Invalidate cache for this user
      const cachePattern = `recommendations:${recommendation.userId}:*`;
      await cacheService.clear(cachePattern);

      return true;
    } catch (error) {
      logger.error(`Failed to delete recommendation: ${error.message}`);
      throw new Error(`Failed to delete recommendation: ${error.message}`);
    }
  }

  static async getRecommendationById(recommendationId) {
    try {
      return await Recommendation.findById(recommendationId)
        .populate('companyId')
        .lean();
    } catch (error) {
      logger.error(`Failed to get recommendation: ${error.message}`);
      throw new Error(`Failed to get recommendation: ${error.message}`);
    }
  }
}

module.exports = RecommendationService;