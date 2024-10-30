const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    maxlength: [500, 'Question text cannot exceed 500 characters']
  },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'open-ended', 'rating', 'boolean'],
    required: true
  },
  options: [{
    text: String,
    value: mongoose.Schema.Types.Mixed
  }],
  isRequired: {
    type: Boolean,
    default: true
  },
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    select: false
  },
  order: {
    type: Number,
    required: true
  }
});

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Survey title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  questions: [questionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'closed'],
    default: 'draft'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  targetAudience: {
    type: String,
    enum: ['all', 'registered', 'specific'],
    default: 'all'
  },
  responses: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    answers: [{
      questionId: mongoose.Schema.Types.ObjectId,
      answer: mongoose.Schema.Types.Mixed
    }],
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

surveySchema.index({ status: 1, startDate: 1, endDate: 1 });
surveySchema.index({ createdBy: 1, status: 1 });

surveySchema.methods.publish = async function() {
  if (!this.questions || this.questions.length === 0) {
    throw new Error('Cannot publish survey without questions');
  }
  
  this.status = 'published';
  this.startDate = new Date();
  await this.save();
  return this;
};

surveySchema.methods.close = async function() {
  this.status = 'closed';
  this.endDate = new Date();
  await this.save();
  return this;
};

surveySchema.methods.addResponse = async function(userId, answers) {
  if (this.status !== 'published') {
    throw new Error('Cannot add response to unpublished survey');
  }

  const response = {
    userId,
    answers: answers.map(answer => ({
      questionId: answer.questionId,
      answer: answer.answer
    }))
  };

  this.responses.push(response);
  await this.save();
  return this;
};

const Survey = mongoose.model('Survey', surveySchema);
module.exports = Survey;