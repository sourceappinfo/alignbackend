const mongoose = require('mongoose');
const authService = require('../../services/authService');
const User = require('../../models/User');

jest.mock('../../models/User');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123'
    };

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      ...userData,
      _id: 'user123',
      password: 'hashedPassword'
    });

    const result = await authService.register(userData);
    expect(result).toHaveProperty('email', userData.email);
  });

  it('should handle duplicate email registration', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123'
    };

    User.findOne.mockResolvedValue({ email: userData.email });

    await expect(
      authService.register(userData)
    ).rejects.toThrow('Email already exists');
  });

  it('should login a user with valid credentials', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockUser = {
      _id: 'user123',
      email: userData.email,
      comparePassword: jest.fn().mockResolvedValue(true)
    };

    User.findOne.mockResolvedValue(mockUser);

    const token = await authService.login(userData.email, userData.password);
    expect(token).toBeTruthy();
  });

  it('should handle invalid login credentials', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    const mockUser = {
      _id: 'user123',
      email: userData.email,
      comparePassword: jest.fn().mockResolvedValue(false)
    };

    User.findOne.mockResolvedValue(mockUser);

    await expect(
      authService.login(userData.email, userData.password)
    ).rejects.toThrow('Invalid credentials');
  });

  it('should handle non-existent user login attempt', async () => {
    User.findOne.mockResolvedValue(null);

    await expect(
      authService.login('nonexistent@example.com', 'password123')
    ).rejects.toThrow('User not found');
  });
});
