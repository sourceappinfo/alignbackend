// models/Company.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    cik: {
      type: String,
      required: true,
      unique: true,
    },
    ticker: String,
    sector: {
      type: String,
      required: true,
    },
    profile: {
      description: String,
      logoUrl: String,
      website: String,
    },
    industry: String,
    tags: [String], // Keywords or categories for recommendation purposes

    // Financial metrics
    financials: {
      revenue: Number,
      netIncome: Number,
      totalAssets: Number,
      totalLiabilities: Number,
      marketCap: Number,
      eps: Number,
      lastUpdated: Date,
    },

    // Governance information
    governance: {
      ceoName: String,
      ceoCompensation: Number,
      boardMembers: [
        {
          name: String,
          role: String,
          compensation: Number,
        },
      ],
    },

    // ESG metrics
    esgMetrics: {
      environmental: Number,
      social: Number,
      governance: Number,
    },
    sustainability: {
      environmentalRating: Number,
      socialRating: Number,
      governanceRating: Number,
      lastUpdated: Date,
    },

    // Ratings (for additional evaluative scores)
    ratings: {
      type: Map,
      of: Number,
      default: {},
    },

    // Legal proceedings and risk factors
    legal: {
      activeProceedings: [
        {
          type: String,
          description: String,
          status: String,
          date: Date,
        },
      ],
      riskFactors: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Company', companySchema);
