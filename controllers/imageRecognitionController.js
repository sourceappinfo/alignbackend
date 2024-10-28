const imageRecognitionService = require('../services/imageRecognitionService');

const analyzeImage = async (req, res) => {
  try {
    const imageUrl = req.body.imageUrl; // Assuming the frontend sends the image URL
    const result = await imageRecognitionService.analyzeImage(imageUrl);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
};

module.exports = {
  analyzeImage,
};
