const Survey = require('../../models/Survey');

describe('Survey Model', () => {
  it('should create a new survey question', async () => {
    const survey = new Survey({
      question: 'How do you feel about sustainability?',
      type: 'scale',
      options: [1, 2, 3, 4, 5],
    });
    await survey.save();

    const foundSurvey = await Survey.findOne({ question: 'How do you feel about sustainability?' });
    expect(foundSurvey).toBeTruthy();
  });
});
