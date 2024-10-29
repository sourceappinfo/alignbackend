const mongoose = require('mongoose');
const Survey = require('../../models/Survey');

describe('Survey Model', () => {
  it('should create a new survey question', async () => {
    const survey = new Survey({
      questionText: 'How do you feel about sustainability?',
      type: 'scale',
      options: [{ label: '1', value: 1 }, { label: '5', value: 5 }], // Assuming this structure is correct for `options`
    });
    await survey.validate(); // This should pass without validation errors
  });
});
