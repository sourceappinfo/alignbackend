const Recommendation = require('../models/Recommendation');
const Company = require('../models/Company');
const Survey = require('../models/Survey');

const generateRecommendations = async (userId) => {
  const userSurvey = await Survey.findOne({ user: userId });
  const relevantCompanies = await Company.find({
    tags: { $in: userSurvey.responses.map((response) => response) },
  });
  
  const recommendations = relevantCompanies.map((company) => {
    return new Recommendation({ user: userId, company: company._id, reason: 'Based on your survey responses' });
  });

  await Recommendation.insertMany(recommendations);
  return recommendations;
};

module.exports = { generateRecommendations };
