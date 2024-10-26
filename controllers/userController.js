const User = require('../models/User');
const { formatResponse } = require('../utils/responseFormatter');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error('User not found');
    res.status(200).json(formatResponse('User profile retrieved', user));
  } catch (error) {
    res.status(404).json(formatResponse('Profile retrieval failed', null, error.message));
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    res.status(200).json(formatResponse('User profile updated', user));
  } catch (error) {
    res.status(400).json(formatResponse('Profile update failed', null, error.message));
  }
};
