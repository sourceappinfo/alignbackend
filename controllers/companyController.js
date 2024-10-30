// controllers/companyController.js
const Company = require('../models/Company');
const SECService = require('../services/secService');
const logger = require('../utils/logger');
const { formatResponse } = require('../utils/responseFormatter');

exports.updateCompanyData = async (cik) => {
  try {
    const profile = await SECService.getCompanyProfile(cik);
    const companyData = { ...profile, lastUpdated: new Date() };

    const company = await Company.findOneAndUpdate({ cik }, companyData, {
      upsert: true,
      new: true,
    });
    return company;
  } catch (error) {
    logger.error(`Error updating data for CIK ${cik}: ${error.message}`); // Added logging
    throw error;
  }
};
