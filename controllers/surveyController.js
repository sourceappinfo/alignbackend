const surveyService = require('../services/surveyService');
const { formatResponse } = require('../utils/responseFormatter');

exports.createSurvey = async (req, res) => {
  try {
    const survey = await surveyService.createSurvey(req.user.id, req.body.questions);
    res.status(201).json(formatResponse('Survey created successfully', survey));
  } catch (error) {
    res.status(400).json(formatResponse('Failed to create survey', null, error.message));
  }
};

exports.submitSurveyResponses = async (req, res) => {
  try {
    const survey = await surveyService.submitSurveyResponses(req.user.id, req.body.responses);
    res.status(200).json(formatResponse('Survey responses submitted successfully', survey));
  } catch (error) {
    res.status(400).json(formatResponse('Failed to submit responses', null, error.message));
  }
};
