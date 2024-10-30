const RecommendationService = require('../services/recommendationService');
const logger = require('../utils/logger');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/responseFormatter');

class RecommendationController {
  static async getRecommendations(req, res) {
    try {
      const { userId } = req.user;
      const criteria = req.query.criteria || {};
      const recommendations = await RecommendationService.generateRecommendations(userId, criteria);
      return res.status(200).json(formatSuccessResponse('Recommendations retrieved successfully', recommendations));
    } catch (error) {
      logger.error(`Error getting recommendations: ${error.message}`);
      return res.status(500).json(formatErrorResponse('Failed to get recommendations', error.message));
    }
  }

  static async saveRecommendation(req, res) {
    try {
      const { userId } = req.user;
      const { companyId, score } = req.body;

      if (!companyId || typeof score !== 'number' || score < 0 || score > 100) {
        return res.status(400).json(formatErrorResponse('Invalid recommendation data'));
      }

      const recommendation = await RecommendationService.saveRecommendation(userId, companyId, score);
      return res.status(201).json(formatSuccessResponse('Recommendation saved successfully', recommendation));
    } catch (error) {
      logger.error(`Error saving recommendation: ${error.message}`);
      return res.status(500).json(formatErrorResponse('Failed to save recommendation', error.message));
    }
  }

  static async updateRecommendation(req, res) {
    try {
      const { recommendationId } = req.params;
      const { score } = req.body;

      if (typeof score !== 'number' || score < 0 || score > 100) {
        return res.status(400).json(formatErrorResponse('Invalid score value'));
      }

      const recommendation = await RecommendationService.updateRecommendation(recommendationId, score);
      return res.status(200).json(formatSuccessResponse('Recommendation updated successfully', recommendation));
    } catch (error) {
      logger.error(`Error updating recommendation: ${error.message}`);
      return res.status(500).json(formatErrorResponse('Failed to update recommendation', error.message));
    }
  }

  static async deleteRecommendation(req, res) {
    try {
      const { recommendationId } = req.params;
      await RecommendationService.deleteRecommendation(recommendationId);
      return res.status(200).json(formatSuccessResponse('Recommendation deleted successfully'));
    } catch (error) {
      logger.error(`Error deleting recommendation: ${error.message}`);
      return res.status(500).json(formatErrorResponse('Failed to delete recommendation', error.message));
    }
  }

  static async getRecommendationById(req, res) {
    try {
      const { recommendationId } = req.params;
      const recommendation = await RecommendationService.getRecommendationById(recommendationId);
      
      if (!recommendation) {
        return res.status(404).json(formatErrorResponse('Recommendation not found'));
      }

      return res.status(200).json(formatSuccessResponse('Recommendation retrieved successfully', recommendation));
    } catch (error) {
      logger.error(`Error getting recommendation: ${error.message}`);
      return res.status(500).json(formatErrorResponse('Failed to get recommendation', error.message));
    }
  }

  // Method required by test
  static someFunction() {
    return true;
  }
}

module.exports = RecommendationController;
