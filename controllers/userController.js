const User = require('../models/User');
const Company = require('../models/Company');

// Submit survey responses
exports.submitSurvey = async (req, res) => {
  const {
    keyValues, 
    valueImportance, 
    productCategories, 
    purchaseFactors, 
    knowledgeRating,
    ethicalSupport,
    stopSupporting,
    ethicalPurchasingFrequency,
    valueAlignmentImportance,
    specificCompanies
  } = req.body;

  try {
    const user = await User.findById(req.user);

    // Update survey responses
    user.surveyResponses = {
      keyValues,
      valueImportance,
      productCategories,
      purchaseFactors,
      knowledgeRating,
      ethicalSupport,
      stopSupporting,
      ethicalPurchasingFrequency,
      valueAlignmentImportance,
      specificCompanies,
    };

    await user.save();

    res.json({ msg: 'Survey responses saved', surveyResponses: user.surveyResponses });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get recommendations based on survey responses
exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user).populate('starredCompanies');

    if (!user.surveyResponses || user.surveyResponses.size === 0) {
      return res.status(400).json({ msg: 'User has not completed the survey' });
    }

    const surveyResponses = user.surveyResponses;

    // Example: Match companies based on the user's environmental preference
    const environmentalImportance = surveyResponses.valueImportance.get('environmental');
    const socialJusticeImportance = surveyResponses.valueImportance.get('social');
    
    // Recommendation logic based on user survey preferences
    const recommendedCompanies = await Company.find({
      'sustainabilityMetrics.environmentalImpact': getMetricValue(environmentalImportance),
      'sustainabilityMetrics.socialImpact': getMetricValue(socialJusticeImportance),
    });

    res.json({
      msg: 'Recommendations generated',
      recommendations: recommendedCompanies,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Helper function to match survey rating (1-5) to company metrics
const getMetricValue = (importance) => {
  switch (importance) {
    case 5: return { $gte: 90 };
    case 4: return { $gte: 70 };
    case 3: return { $gte: 50 };
    case 2: return { $gte: 30 };
    case 1: return { $lt: 30 };
    default: return { $gte: 50 };
  }
};
