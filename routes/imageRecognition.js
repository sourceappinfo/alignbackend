const express = require('express');
const router = express.Router();
const imageRecognitionController = require('../controllers/imageRecognitionController');

router.post('/analyze', imageRecognitionController.analyzeImage);

module.exports = router;
