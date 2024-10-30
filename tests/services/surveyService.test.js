const mongoose = require('mongoose');
const Survey = require('../../models/Survey');
const SurveyService = require('../../services/surveyService');
const cacheService = require('../../services/cacheService');

jest.mock('../../models/Survey');
jest.mock('../../services/cacheService');

describe('Survey Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSurvey', () => {
    const mockSurveyData = {
      title: 'Test Survey',
      description: 'Test Description',
      questions: [
        {
          questionText: 'Test Question',
          questionType: 'multiple-choice',
          options: ['Option 1', 'Option 2']
        }
      ],
      createdBy: new mongoose.Types.ObjectId()
    };

    it('should create a survey successfully', async () => {
      const mockCreatedSurvey = { 
        _id: new mongoose.Types.ObjectId(),
        ...mockSurveyData,
        status: 'draft'
      };

      Survey.create.mockResolvedValue(mockCreatedSurvey);
      cacheService.del.mockResolvedValue(true);

      const result = await SurveyService.createSurvey(mockSurveyData);

      expect(Survey.create).toHaveBeenCalledWith(expect.objectContaining({
        title: mockSurveyData.title,
        status: 'draft'
      }));
      expect(result).toEqual(mockCreatedSurvey);
      expect(cacheService.del).toHaveBeenCalledWith(
        `surveys:user:${mockSurveyData.createdBy}`
      );
    });

    it('should throw error for invalid question format', async () => {
      const invalidData = {
        ...mockSurveyData,
        questions: [{ invalidField: 'test' }]
      };

      await expect(SurveyService.createSurvey(invalidData))
        .rejects.toThrow('Invalid question format');
    });
  });

  describe('getAllSurveys', () => {
    const mockSurveys = [
      { _id: new mongoose.Types.ObjectId(), title: 'Survey 1' },
      { _id: new mongoose.Types.ObjectId(), title: 'Survey 2' }
    ];

    it('should return cached surveys if available', async () => {
      const mockCachedResult = {
        surveys: mockSurveys,
        pagination: { current: 1, total: 1 }
      };

      cacheService.get.mockResolvedValue(mockCachedResult);

      const result = await SurveyService.getAllSurveys();

      expect(result).toEqual(mockCachedResult);
      expect(Survey.find).not.toHaveBeenCalled();
    });

    it('should fetch and cache surveys if not cached', async () => {
      cacheService.get.mockResolvedValue(null);
      Survey.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockSurveys)
      });
      Survey.countDocuments.mockResolvedValue(mockSurveys.length);

      const result = await SurveyService.getAllSurveys();

      expect(result.surveys).toEqual(mockSurveys);
      expect(cacheService.set).toHaveBeenCalled();
    });
  });

  // Additional test suites...
});