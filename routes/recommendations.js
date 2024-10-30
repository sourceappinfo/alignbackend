const express = require('express');
const router = express.Router();
const RecommendationService = require('../services/recommendationService');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/responseFormatter');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes in this router
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const recommendations = await RecommendationService.generateRecommendations(req.user.id, req.query.criteria);
    res.status(200).json(formatSuccessResponse('Recommendations retrieved successfully', recommendations));
  } catch (error) {
    res.status(500).json(formatErrorResponse('Failed to generate recommendations', error.message));
  }
});

router.post('/', async (req, res) => {
  try {
    const { companyId, score } = req.body;

    if (!companyId || typeof score !== 'number') {
      return res.status(400).json(formatErrorResponse('Invalid request data'));
    }

    const recommendation = await RecommendationService.saveRecommendation(req.user.id, companyId, score);
    res.status(201).json(formatSuccessResponse('Recommendation saved successfully', recommendation));
  } catch (error) {
    res.status(500).json(formatErrorResponse('Failed to save recommendation', error.message));
  }
});

module.exports = router;
