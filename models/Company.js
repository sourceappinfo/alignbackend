const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  // Basic Info
  name: { type: String, required: true },
  cik: { type: String, required: true, unique: true },
  ticker: String,
  industry: String,
  description: String,
  sicCode: String,
  sicDescription: String,
  employeeCount: Number,

  // Contact & Location
  addresses: {
    headquarters: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String
    },
    mailing: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String
    }
  },

  // Financial Data
  financials: {
    revenue: {
      value: Number,
      year: Number,
      quarter: String
    },
    netIncome: {
      value: Number,
      year: Number,
      quarter: String
    },
    totalAssets: Number,
    totalLiabilities: Number,
    marketCap: Number,
    eps: Number,
    debtToEquityRatio: Number,
    lastUpdated: Date
  },

  // Executive & Governance
  governance: {
    executives: [{
      name: String,
      title: String,
      compensation: Number,
      year: Number
    }],
    boardMembers: [{
      name: String,
      role: String,
      compensation: Number
    }]
  },

  // ESG Data
  esgMetrics: {
    environmental: {
      carbonEmissions: Number,
      wasteManagement: String,
      energyEfficiency: String,
      rating: Number
    },
    social: {
      employeeSatisfaction: Number,
      diversityScore: Number,
      communityImpact: String,
      rating: Number
    },
    governance: {
      boardDiversity: Number,
      ethicsRating: Number,
      transparencyScore: Number,
      rating: Number
    },
    lastUpdated: Date
  },

  // Legal & Compliance
  legal: {
    activeLitigations: [{
      case: String,
      description: String,
      status: String,
      filingDate: Date
    }],
    regulatoryIssues: [{
      type: String,
      description: String,
      status: String,
      date: Date
    }],
    riskFactors: [String]
  },

  // User Interaction Metrics
  userMetrics: {
    overallRating: Number,
    totalRatings: Number,
    likes: Number,
    views: Number
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
companySchema.index({ name: 'text', ticker: 'text' });
companySchema.index({ cik: 1 }, { unique: true });
companySchema.index({ 'userMetrics.overallRating': -1 });

// Methods
companySchema.methods.updateFinancials = async function(newData) {
  this.financials = { ...this.financials, ...newData, lastUpdated: new Date() };
  return this.save();
};

companySchema.methods.updateESGMetrics = async function(newData) {
  this.esgMetrics = { ...this.esgMetrics, ...newData, lastUpdated: new Date() };
  return this.save();
};

// Static methods
companySchema.statics.findByCIK = function(cik) {
  return this.findOne({ cik });
};

companySchema.statics.findByTicker = function(ticker) {
  return this.findOne({ ticker });
};

const Company = mongoose.model('Company', companySchema);
module.exports = Company;