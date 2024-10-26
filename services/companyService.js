const Company = require('../models/Company');

const getAllCompanies = async () => {
  return await Company.find({});
};

const getCompanyById = async (companyId) => {
  return await Company.findById(companyId);
};

const updateCompany = async (companyId, updates) => {
  return await Company.findByIdAndUpdate(companyId, updates, { new: true });
};

module.exports = { getAllCompanies, getCompanyById, updateCompany };
