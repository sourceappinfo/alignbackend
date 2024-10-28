// services/searchService.js
const Company = require('../models/Company');
const User = require('../models/User');

const search = async (query) => {
  const companyResults = await Company.find({ name: { $regex: query, $options: 'i' } });
  const userResults = await User.find({ name: { $regex: query, $options: 'i' } });
  return { companies: companyResults, users: userResults };
};

module.exports = { search };
