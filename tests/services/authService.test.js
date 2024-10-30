const mongoose = require('mongoose');
const AuthService = require('../../services/authService');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

jest.mock('../../models/User');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: userData.email,
        name: userData.name
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mock-token');

      const result = await AuthService.register(userData);

      expect(result).toHaveProperty('token', 'mock-token');
      expect(result.user).toEqual({
        id: mockUser._id,
        email: mockUser.email,
        name: mockUser.name
      });
    });
  });

  describe('login', () => {
    it('should login a user with valid credentials', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
        name: 'Test User',
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mock-token');

      const result = await AuthService.login('test@example.com', 'password123');

      expect(result).toHaveProperty('token', 'mock-token');
      expect(result.user).toEqual({
        id: mockUser._id,
        email: mockUser.email,
        name: mockUser.name
      });
      expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should reject invalid credentials', async () => {
      const mockUser = {
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      User.findOne.mockResolvedValue(mockUser);

      await expect(
        AuthService.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });
});