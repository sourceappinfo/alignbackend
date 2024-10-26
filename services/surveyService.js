const Survey = require('../models/Survey');

const createSurvey = async (userId, questions) => {
  const survey = new Survey({ user: userId, questions });
  await survey.save();
  return survey;
};

const submitSurveyResponses = async (userId, responses) => {
  const survey = await Survey.findOne({ user: userId });
  if (!survey) throw new Error('Survey not found');

  survey.responses = responses;
  await survey.save();

  return survey;
};

module.exports = { createSurvey, submitSurveyResponses };
