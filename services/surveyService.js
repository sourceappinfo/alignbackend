const Survey = require('../models/Survey');
const cacheService = require('./cacheService');
const logger = require('../utils/logger');
const { ValidationError } = require('../utils/errorTypes');

class SurveyService {
  static async createSurvey(surveyData) {
    try {
      const { title, description, questions, createdBy } = surveyData;

      // Validate questions structure
      if (!questions.every(q => q.questionText && q.questionType)) {
        throw new ValidationError('Invalid question format');
      }

      // Add order to questions if not provided
      const questionsWithOrder = questions.map((q, index) => ({
        ...q,
        order: q.order || index + 1
      }));

      const survey = await Survey.create({
        title,
        description,
        questions: questionsWithOrder,
        createdBy,
        status: 'draft'
      });

      // Invalidate relevant cache
      await cacheService.del(`surveys:user:${createdBy}`);

      return survey;
    } catch (error) {
      logger.error(`Survey creation error: ${error.message}`);
      throw error;
    }
  }

  static async getAllSurveys(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      // Try to get from cache for common queries
      const cacheKey = `surveys:${JSON.stringify(filters)}:${page}:${limit}`;
      const cachedResult = await cacheService.get(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      const query = { ...filters };
      if (filters.status === 'published') {
        query.startDate = { $lte: new Date() };
        query.endDate = { $gt: new Date() };
      }

      const [surveys, total] = await Promise.all([
        Survey.find(query)
          .populate('createdBy', 'name email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Survey.countDocuments(query)
      ]);

      const result = {
        surveys,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: surveys.length,
          totalRecords: total
        }
      };

      // Cache the result
      await cacheService.set(cacheKey, result, 300); // Cache for 5 minutes

      return result;
    } catch (error) {
      logger.error(`Survey retrieval error: ${error.message}`);
      throw error;
    }
  }

  static async getSurveyById(surveyId) {
    try {
      const cacheKey = `survey:${surveyId}`;
      const cachedSurvey = await cacheService.get(cacheKey);
      if (cachedSurvey) {
        return cachedSurvey;
      }

      const survey = await Survey.findById(surveyId)
        .populate('createdBy', 'name email')
        .lean();

      if (!survey) {
        throw new ValidationError('Survey not found');
      }

      await cacheService.set(cacheKey, survey, 300);
      return survey;
    } catch (error) {
      logger.error(`Survey retrieval error: ${error.message}`);
      throw error;
    }
  }

  static async updateSurvey(surveyId, updates, userId) {
    try {
      const survey = await Survey.findOne({ _id: surveyId, createdBy: userId });

      if (!survey) {
        throw new ValidationError('Survey not found or unauthorized');
      }

      if (survey.status !== 'draft') {
        throw new ValidationError('Cannot update published or closed survey');
      }

      // Handle question updates
      if (updates.questions) {
        updates.questions = updates.questions.map((q, index) => ({
          ...q,
          order: q.order || index + 1
        }));
      }

      const updatedSurvey = await Survey.findByIdAndUpdate(
        surveyId,
        { $set: updates },
        { new: true, runValidators: true }
      );

      // Invalidate caches
      await Promise.all([
        cacheService.del(`survey:${surveyId}`),
        cacheService.del(`surveys:user:${userId}`)
      ]);

      return updatedSurvey;
    } catch (error) {
      logger.error(`Survey update error: ${error.message}`);
      throw error;
    }
  }

  static async deleteSurvey(surveyId, userId) {
    try {
      const survey = await Survey.findOneAndDelete({
        _id: surveyId,
        createdBy: userId,
        status: 'draft'
      });

      if (!survey) {
        throw new ValidationError('Survey not found or cannot be deleted');
      }

      // Invalidate caches
      await Promise.all([
        cacheService.del(`survey:${surveyId}`),
        cacheService.del(`surveys:user:${userId}`)
      ]);

      return true;
    } catch (error) {
      logger.error(`Survey deletion error: ${error.message}`);
      throw error;
    }
  }

  static async publishSurvey(surveyId, userId) {
    try {
      const survey = await Survey.findOne({ _id: surveyId, createdBy: userId });

      if (!survey) {
        throw new ValidationError('Survey not found or unauthorized');
      }

      if (survey.status !== 'draft') {
        throw new ValidationError('Survey is already published or closed');
      }

      if (!survey.questions || survey.questions.length === 0) {
        throw new ValidationError('Cannot publish survey without questions');
      }

      survey.status = 'published';
      survey.startDate = new Date();
      await survey.save();

      // Invalidate caches
      await Promise.all([
        cacheService.del(`survey:${surveyId}`),
        cacheService.del(`surveys:user:${userId}`)
      ]);

      return survey;
    } catch (error) {
      logger.error(`Survey publication error: ${error.message}`);
      throw error;
    }
  }

  // Additional methods continue...

}

module.exports = SurveyService;
