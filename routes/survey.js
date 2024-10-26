const express = require('express');
const surveyController = require('../controllers/surveyController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// POST /api/surveys
router.post('/', authMiddleware, surveyController.createSurvey);

// POST /api/surveys/responses
router.post('/responses', authMiddleware, surveyController.submitSurveyResponses);

module.exports = router;
