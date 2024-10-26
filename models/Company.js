const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  sector: {
    type: String,
    required: true,
  },
  profile: {
    description: String,
    logoUrl: String,
    website: String,
  },
  esgMetrics: {
    environmental: Number,
    social: Number,
    governance: Number,
  },
  ratings: {
    type: Map,
    of: Number,
    default: {},
  },
  tags: [String], // Keywords or categories for recommendation purposes
}, {
  timestamps: true,
});

module.exports = mongoose.model('Company', companySchema);
