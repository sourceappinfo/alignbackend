// services/authService.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const register = async (userData) => {
  const { name, email, password } = userData;
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error('User already exists');
  
  const user = new User({ name, email, password });
  await user.save();

  return { user, token: generateToken(user) };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid credentials');
  }
  
  return { user, token: generateToken(user) };
};

module.exports = { register, login };
