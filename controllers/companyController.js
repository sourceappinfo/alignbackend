const companyService = require('../services/companyService');
const { formatResponse } = require('../utils/responseFormatter');

exports.getCompanies = async (req, res) => {
  try {
    const companies = await companyService.getAllCompanies();
    res.status(200).json(formatResponse('Companies retrieved successfully', companies));
  } catch (error) {
    res.status(500).json(formatResponse('Failed to retrieve companies', null, error.message));
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    if (!company) throw new Error('Company not found');
    res.status(200).json(formatResponse('Company retrieved successfully', company));
  } catch (error) {
    res.status(404).json(formatResponse('Failed to retrieve company', null, error.message));
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const updatedCompany = await companyService.updateCompany(req.params.id, req.body);
    res.status(200).json(formatResponse('Company updated successfully', updatedCompany));
  } catch (error) {
    res.status(400).json(formatResponse('Company update failed', null, error.message));
  }
};