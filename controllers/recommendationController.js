// controllers/recommendationController.js
const recommendationService = require('../services/recommendationService');
const { formatResponse } = require('../utils/responseFormatter');

exports.getRecommendations = async (req, res) => {
  try {
    const recommendations = await recommendationService.generateRecommendations(req.user.id);
    res.status(200).json(formatResponse('Recommendations retrieved', recommendations));
  } catch (error) {
    res.status(500).json(formatResponse('Failed to retrieve recommendations', null, error.message));
  }
};
