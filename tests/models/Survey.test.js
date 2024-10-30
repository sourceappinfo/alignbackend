const mongoose = require('mongoose');
const Survey = require('../../models/Survey');

describe('Survey Model', () => {
  it('should create a new survey question', async () => {
    const mockSurvey = {
      title: 'Test Survey',
      description: 'Test Description',
      questions: [{
        questionText: 'How do you feel about sustainability?',
        questionType: 'multiple-choice',
        options: [{
          text: '1',
          value: 1
        }, {
          text: '5',
          value: 5
        }],
        order: 1
      }],
      createdBy: new mongoose.Types.ObjectId()
    };

    const survey = new Survey(mockSurvey);
    await expect(survey.validate()).resolves.toBeUndefined();
  });

  it('should reject invalid survey data', async () => {
    const invalidSurvey = new Survey({
      questions: [{
        questionType: 'invalid-type'
      }]
    });

    await expect(invalidSurvey.validate()).rejects.toThrow();
  });
});