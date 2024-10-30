const mongoose = require('mongoose');
const AuthService = require('../../services/authService');
const User = require('../../models/User');

jest.mock('../../models/User');

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

      const result = await AuthService.register(userData);

      expect(result).toHaveProperty('token');
      expect(result.user).toEqual({
        email: mockUser.email,
        id: mockUser._id,
        name: mockUser.name
      });
    });
  });

  describe('login', () => {
    it('should login a user with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: credentials.email,
        name: 'Test User',
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockResolvedValue(mockUser);

      const result = await AuthService.login(credentials.email, credentials.password);

      expect(result).toHaveProperty('token');
      expect(result.user).toEqual({
        email: mockUser.email,
        id: mockUser._id,
        name: mockUser.name
      });
    });
  });
});
