const SurveyController = require('../../controllers/surveyController');
const SurveyService = require('../../services/surveyService');
const { formatSuccessResponse, formatErrorResponse } = require('../../utils/responseFormatter');

jest.mock('../../services/surveyService');

describe('Survey Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 'mockUserId' },
      body: {},
      params: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('createSurvey', () => {
    const mockSurveyData = {
      title: 'Test Survey',
      description: 'Test Description',
      questions: [
        {
          questionText: 'Test Question',
          questionType: 'multiple-choice'
        }
      ]
    };

    it('should create survey successfully', async () => {
      req.body = mockSurveyData;
      const mockCreatedSurvey = { _id: 'surveyId', ...mockSurveyData };
      
      SurveyService.createSurvey.mockResolvedValue(mockCreatedSurvey);

      await SurveyController.createSurvey(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        formatSuccessResponse('Survey created successfully', mockCreatedSurvey)
      );
    });

    it('should handle validation error', async () => {
      req.body = { title: 'Test' }; // Missing required fields

      await SurveyController.createSurvey(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false
        })
      );
    });
  });

  // Additional test suites...
});