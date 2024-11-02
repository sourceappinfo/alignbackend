// tests/controllers/authController.test.js

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AuthController = require('../../controllers/authController');
const User = require('../../models/User');
const { ValidationError, AuthenticationError } = require('../../utils/errorTypes');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');
jest.mock('../../models/User');

describe('Auth Controller', () => {
  let mockRequest;
  let mockResponse;
  let mockUser;
  let mockToken;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup mock data
    mockToken = 'mock.jwt.token';
    mockUser = {
      _id: new mongoose.Types.ObjectId(),
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedPassword123',
      save: jest.fn().mockResolvedValue(true),
      comparePassword: jest.fn(),
      generateAuthToken: jest.fn().mockReturnValue(mockToken),
      toObject: jest.fn().mockReturnThis()
    };

    // Setup request and response
    mockRequest = {
      body: {},
      headers: {},
      user: null
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };

    // Setup JWT mock
    jwt.sign.mockReturnValue(mockToken);
    jwt.verify.mockReturnValue({ userId: mockUser._id });
  });

  describe('register', () => {
    beforeEach(() => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };
    });

    it('should register a new user successfully', async () => {
      // Mock that user doesn't exist yet
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);

      await AuthController.register(mockRequest, mockResponse);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockRequest.body.email });
      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
        email: mockRequest.body.email,
        name: mockRequest.body.name
      }));
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Registration successful',
        data: {
          token: mockToken,
          user: expect.objectContaining({
            email: mockUser.email,
            name: mockUser.name
          })
        }
      });
    });

    it('should reject registration with existing email', async () => {
      User.findOne.mockResolvedValue(mockUser);

      await AuthController.register(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'User already exists'
      });
    });

    it('should handle missing required fields', async () => {
      mockRequest.body = { email: 'test@example.com' }; // Missing password

      await AuthController.register(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Email and password are required'
      });
    });
  });

  describe('login', () => {
    beforeEach(() => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123'
      };
    });

    it('should login user successfully', async () => {
      mockUser.comparePassword.mockResolvedValue(true);
      User.findOne.mockResolvedValue(mockUser);

      await AuthController.login(mockRequest, mockResponse);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockRequest.body.email });
      expect(mockUser.comparePassword).toHaveBeenCalledWith(mockRequest.body.password);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        data: {
          token: mockToken,
          user: expect.objectContaining({
            email: mockUser.email,
            name: mockUser.name
          })
        }
      });
    });

    it('should reject invalid credentials', async () => {
      mockUser.comparePassword.mockResolvedValue(false);
      User.findOne.mockResolvedValue(mockUser);

      await AuthController.login(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid credentials'
      });
    });

    it('should handle non-existent user', async () => {
      User.findOne.mockResolvedValue(null);

      await AuthController.login(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid credentials'
      });
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', async () => {
      mockRequest.body = { token: mockToken };

      await AuthController.verifyToken(mockRequest, mockResponse);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Token is valid',
        data: { userId: mockUser._id }
      });
    });

    it('should reject invalid token', async () => {
      mockRequest.body = { token: 'invalid.token' };
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await AuthController.verifyToken(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid or expired token'
      });
    });
  });

  describe('changePassword', () => {
    beforeEach(() => {
      mockRequest.user = { id: mockUser._id };
      mockRequest.body = {
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123'
      };
    });

    it('should change password successfully', async () => {
      mockUser.comparePassword.mockResolvedValue(true);
      User.findById.mockResolvedValue(mockUser);

      await AuthController.changePassword(mockRequest, mockResponse);

      expect(mockUser.comparePassword).toHaveBeenCalledWith(mockRequest.body.currentPassword);
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password changed successfully'
      });
    });

    it('should reject incorrect current password', async () => {
      mockUser.comparePassword.mockResolvedValue(false);
      User.findById.mockResolvedValue(mockUser);

      await AuthController.changePassword(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Current password is incorrect'
      });
    });
  });

  describe('requestPasswordReset', () => {
    beforeEach(() => {
      mockRequest.body = { email: 'test@example.com' };
    });

    it('should generate reset token successfully', async () => {
      User.findOne.mockResolvedValue(mockUser);

      await AuthController.requestPasswordReset(mockRequest, mockResponse);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockRequest.body.email });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password reset email sent',
        data: { resetToken: expect.any(String) }
      });
    });

    it('should handle non-existent email', async () => {
      User.findOne.mockResolvedValue(null);

      await AuthController.requestPasswordReset(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'No account found with this email'
      });
    });
  });
});