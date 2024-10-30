const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, { timestamps: true });

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
module.exports = Recommendation;