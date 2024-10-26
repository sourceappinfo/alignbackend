const Company = require('../models/Company');
const User = require('../models/User');
const { formatResponse } = require('../utils/responseFormatter');

exports.search = async (req, res) => {
  try {
    const { query } = req.query;
    const companyResults = await Company.find({ name: { $regex: query, $options: 'i' } });
    const userResults = await User.find({ name: { $regex: query, $options: 'i' } });
    const results = { companies: companyResults, users: userResults };

    res.status(200).json(formatResponse('Search results retrieved', results));
  } catch (error) {
    res.status(500).json(formatResponse('Search failed', null, error.message));
  }
};
