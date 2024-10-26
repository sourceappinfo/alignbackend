const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// GET /api/recommendations
router.get('/', authMiddleware, recommendationController.getRecommendations);

module.exports = router;
