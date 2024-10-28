// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  // User survey responses
  surveyResponses: {
    keyValues: [{ type: String }], // Values important to the user (Q1)
    valueImportance: { type: Map, of: Number }, // Ratings (Q2)
    productCategories: { type: Map, of: String }, // Product categories (Q3)
    purchaseFactors: [{ type: String }], // Influencing factors (Q4)
    knowledgeRating: { type: Map, of: Number }, // Knowledge ratings (Q5)
    ethicalSupport: { type: String }, // Ethical support response (Q6)
    stopSupporting: [{ type: String }], // Reasons to stop supporting (Q8)
    ethicalPurchasingFrequency: { type: String }, // Ethical purchasing frequency (Q9)
    valueAlignmentImportance: { type: Number }, // Importance of alignment (Q10)
    specificCompanies: [{ type: String }], // Companies to support (Q11)
  },
  // Starred companies and preferences
  starredCompanies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],
  preferences: {
    type: Map,
    of: String, // Store specific user preferences
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, {
  timestamps: true,
});

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
