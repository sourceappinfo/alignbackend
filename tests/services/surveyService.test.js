const mongoose = require('mongoose');
const Survey = require('../../models/Survey');
const SurveyService = require('../../services/surveyService');
const cacheService = require('../../services/cacheService');
const { ValidationError } = require('../../utils/errorTypes');

jest.mock('../../models/Survey');
jest.mock('../../services/cacheService');

describe('Survey Service', () => {
  let mockSurvey;
  let mockUserId;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserId = new mongoose.Types.ObjectId();
    mockSurvey = {
      _id: new mongoose.Types.ObjectId(),
      title: 'Test Survey',
      description: 'Test Description',
      questions: [
        {
          questionText: 'Test Question',
          questionType: 'multiple-choice',
          options: ['Option 1', 'Option 2'],
          order: 1
        }
      ],
      createdBy: mockUserId,
      status: 'draft'
    };
  });

  describe('createSurvey', () => {
    it('should create a survey successfully', async () => {
      Survey.create.mockResolvedValue(mockSurvey);
      cacheService.del.mockResolvedValue(true);

      const result = await SurveyService.createSurvey(mockSurvey);

      expect(Survey.create).toHaveBeenCalledWith(expect.objectContaining({
        title: mockSurvey.title,
        description: mockSurvey.description
      }));
      expect(result).toEqual(mockSurvey);
      expect(cacheService.del).toHaveBeenCalledWith(`surveys:user:${mockSurvey.createdBy}`);
    });

    it('should throw error for invalid question format', async () => {
      const invalidSurvey = {
        ...mockSurvey,
        questions: [{ invalidField: 'test' }]
      };

      await expect(SurveyService.createSurvey(invalidSurvey))
        .rejects.toThrow(ValidationError);
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
      const mockQueryChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockSurveys)
      };

      cacheService.get.mockResolvedValue(null);
      Survey.find.mockReturnValue(mockQueryChain);
      Survey.countDocuments.mockResolvedValue(mockSurveys.length);

      const result = await SurveyService.getAllSurveys();

      expect(result.surveys).toEqual(mockSurveys);
      expect(Survey.find).toHaveBeenCalled();
      expect(mockQueryChain.populate).toHaveBeenCalledWith('createdBy', 'name email');
      expect(mockQueryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(cacheService.set).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      Survey.find.mockRejectedValue(new Error('Database error'));

      await expect(SurveyService.getAllSurveys())
        .rejects.toThrow('Database error');
    });
  });

  describe('getSurveyById', () => {
    it('should return survey by id', async () => {
      const mockQueryChain = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockSurvey)
      };

      Survey.findById.mockReturnValue(mockQueryChain);

      const result = await SurveyService.getSurveyById(mockSurvey._id);

      expect(result).toEqual(mockSurvey);
      expect(Survey.findById).toHaveBeenCalledWith(mockSurvey._id);
      expect(mockQueryChain.populate).toHaveBeenCalledWith('createdBy', 'name email');
    });

    it('should throw error if survey not found', async () => {
      const mockQueryChain = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null)
      };

      Survey.findById.mockReturnValue(mockQueryChain);

      await expect(SurveyService.getSurveyById(mockSurvey._id))
        .rejects.toThrow(ValidationError);
    });
  });

  describe('updateSurvey', () => {
    it('should update survey successfully', async () => {
      const updates = { title: 'Updated Title' };
      const updatedSurvey = { ...mockSurvey, ...updates };

      Survey.findOne.mockResolvedValue(mockSurvey);
      Survey.findByIdAndUpdate.mockResolvedValue(updatedSurvey);

      const result = await SurveyService.updateSurvey(mockSurvey._id, updates, mockUserId);

      expect(result).toEqual(updatedSurvey);
      expect(Survey.findOne).toHaveBeenCalledWith({ 
        _id: mockSurvey._id, 
        createdBy: mockUserId 
      });
    });

    it('should throw error if survey not found', async () => {
      Survey.findOne.mockResolvedValue(null);

      await expect(SurveyService.updateSurvey(mockSurvey._id, {}, mockUserId))
        .rejects.toThrow(ValidationError);
    });
  });
});