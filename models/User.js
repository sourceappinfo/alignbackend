const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  
  // Survey Responses
  surveyResponses: {
    keyValues: [{ type: String }], // Values important to the user (Q1)
    valueImportance: { type: Map, of: Number }, // 1-5 ratings (Q2)
    productCategories: { type: Map, of: String }, // Frequency of purchases in product categories (Q3)
    purchaseFactors: [{ type: String }], // Factors that influence purchasing (Q4)
    knowledgeRating: { type: Map, of: Number }, // Knowledge ratings for CSR, ESG, etc. (Q5)
    ethicalSupport: { type: String }, // Yes/No/Maybe (Q6)
    stopSupporting: [{ type: String }], // Factors that make them stop supporting a company (Q8)
    ethicalPurchasingFrequency: { type: String }, // Frequency of ethical purchasing (Q9)
    valueAlignmentImportance: { type: Number }, // Importance of aligning purchases with values (Q10)
    specificCompanies: [{ type: String }], // Specific companies they'd like to support (Q11)
  },

  // Starred Companies
  starredCompanies: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company' 
  }]
});

module.exports = mongoose.model('User', UserSchema);
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
