const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      label: String,
      value: String,
    },
  ],
  responses: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      response: String,
    },
  ],
  category: String, // e.g., environmental, social
}, {
  timestamps: true,
});

module.exports = mongoose.model('Survey', surveySchema);
