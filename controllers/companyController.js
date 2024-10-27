// controllers/companyController.js
const Company = require('../models/Company');
const SECService = require('../services/secService');
const companyService = require('../services/companyService');
const logger = require('../utils/logger');
const { formatResponse } = require('../utils/responseFormatter');

// Controller to fetch and update company data using the SEC API and store it in the database
exports.updateCompanyData = async (cik) => {
  try {
    const [profile, financials] = await Promise.all([
      SECService.getCompanyProfile(cik),
      SECService.getFinancialData(cik)
    ]);

    const companyData = {
      ...profile,
      financials: {
        ...financials,
        lastUpdated: new Date()
      }
    };

    const company = await Company.findOneAndUpdate(
      { cik },
      companyData,
      { upsert: true, new: true }
    );

    return company;
  } catch (error) {
    logger.error(`Error updating company data for CIK ${cik}:`, error);
    throw error;
  }
};

// Controller to get all companies
exports.getCompanies = async (req, res) => {
  try {
    const companies = await companyService.getAllCompanies();
    res.status(200).json(formatResponse('Companies retrieved successfully', companies));
  } catch (error) {
    res.status(500).json(formatResponse('Failed to retrieve companies', null, error.message));
  }
};

// Controller to get a single company by its ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    if (!company) throw new Error('Company not found');
    res.status(200).json(formatResponse('Company retrieved successfully', company));
  } catch (error) {
    res.status(404).json(formatResponse('Failed to retrieve company', null, error.message));
  }
};

// Controller to update a company by its ID
exports.updateCompany = async (req, res) => {
  try {
    const updatedCompany = await companyService.updateCompany(req.params.id, req.body);
    res.status(200).json(formatResponse('Company updated successfully', updatedCompany));
  } catch (error) {
    res.status(400).json(formatResponse('Company update failed', null, error.message));
  }
};
