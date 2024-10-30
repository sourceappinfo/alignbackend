const SurveyService = require('../services/surveyService');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/responseFormatter');
const logger = require('../utils/logger');
const { ValidationError } = require('../utils/errorTypes');

class SurveyController {
  static async createSurvey(req, res) {
    try {
      const { title, description, questions } = req.body;
      const createdBy = req.user.id;

      if (!title || !questions || !Array.isArray(questions)) {
        return res.status(400).json(
          formatErrorResponse('Title and questions array are required')
        );
      }

      const survey = await SurveyService.createSurvey({
        title,
        description,
        questions,
        createdBy
      });

      return res.status(201).json(
        formatSuccessResponse('Survey created successfully', survey)
      );
    } catch (error) {
      logger.error(`Survey creation error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Failed to create survey')
      );
    }
  }

  static async getSurveys(req, res) {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      const filters = status ? { status } : {};
      
      const surveys = await SurveyService.getAllSurveys(filters, {
        page: parseInt(page),
        limit: parseInt(limit)
      });

      return res.status(200).json(
        formatSuccessResponse('Surveys retrieved successfully', surveys)
      );
    } catch (error) {
      logger.error(`Survey retrieval error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Failed to retrieve surveys')
      );
    }
  }

  static async getSurveyById(req, res) {
    try {
      const { surveyId } = req.params;
      const survey = await SurveyService.getSurveyById(surveyId);

      if (!survey) {
        return res.status(404).json(
          formatErrorResponse('Survey not found')
        );
      }

      return res.status(200).json(
        formatSuccessResponse('Survey retrieved successfully', survey)
      );
    } catch (error) {
      logger.error(`Survey retrieval error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Failed to retrieve survey')
      );
    }
  }

  static async updateSurvey(req, res) {
    try {
      const { surveyId } = req.params;
      const updates = req.body;
      const userId = req.user.id;

      const survey = await SurveyService.updateSurvey(surveyId, updates, userId);

      return res.status(200).json(
        formatSuccessResponse('Survey updated successfully', survey)
      );
    } catch (error) {
      logger.error(`Survey update error: ${error.message}`);
      
      if (error instanceof ValidationError) {
        return res.status(400).json(formatErrorResponse(error.message));
      }

      return res.status(500).json(
        formatErrorResponse('Failed to update survey')
      );
    }
  }

  static async deleteSurvey(req, res) {
    try {
      const { surveyId } = req.params;
      const userId = req.user.id;

      await SurveyService.deleteSurvey(surveyId, userId);

      return res.status(200).json(
        formatSuccessResponse('Survey deleted successfully')
      );
    } catch (error) {
      logger.error(`Survey deletion error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Failed to delete survey')
      );
    }
  }

  static async submitResponse(req, res) {
    try {
      const { surveyId } = req.params;
      const { answers } = req.body;
      const userId = req.user.id;

      const response = await SurveyService.submitResponse(surveyId, userId, answers);

      return res.status(201).json(
        formatSuccessResponse('Response submitted successfully', response)
      );
    } catch (error) {
      logger.error(`Survey response submission error: ${error.message}`);
      
      if (error instanceof ValidationError) {
        return res.status(400).json(formatErrorResponse(error.message));
      }

      return res.status(500).json(
        formatErrorResponse('Failed to submit response')
      );
    }
  }

  static async getSurveyResponses(req, res) {
    try {
      const { surveyId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const responses = await SurveyService.getSurveyResponses(surveyId, {
        page: parseInt(page),
        limit: parseInt(limit)
      });

      return res.status(200).json(
        formatSuccessResponse('Responses retrieved successfully', responses)
      );
    } catch (error) {
      logger.error(`Survey responses retrieval error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Failed to retrieve responses')
      );
    }
  }

  static async publishSurvey(req, res) {
    try {
      const { surveyId } = req.params;
      const userId = req.user.id;

      const survey = await SurveyService.publishSurvey(surveyId, userId);

      return res.status(200).json(
        formatSuccessResponse('Survey published successfully', survey)
      );
    } catch (error) {
      logger.error(`Survey publication error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Failed to publish survey')
      );
    }
  }

  static async closeSurvey(req, res) {
    try {
      const { surveyId } = req.params;
      const userId = req.user.id;

      const survey = await SurveyService.closeSurvey(surveyId, userId);

      return res.status(200).json(
        formatSuccessResponse('Survey closed successfully', survey)
      );
    } catch (error) {
      logger.error(`Survey closure error: ${error.message}`);
      return res.status(500).json(
        formatErrorResponse('Failed to close survey')
      );
    }
  }
}

module.exports = SurveyController;