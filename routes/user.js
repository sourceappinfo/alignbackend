const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to submit survey responses
router.post('/submit-survey', authMiddleware, userController.submitSurvey);

// Route to get recommendations based on survey responses
router.get('/recommendations', authMiddleware, userController.getRecommendations);

module.exports = router;
