// tests/controllers/userController.test.js

const mongoose = require('mongoose');
const User = require('../../models/User');
const UserController = require('../../controllers/userController');
const { ValidationError } = require('../../utils/errorTypes');

// Mock the User model and its methods
jest.mock('../../models/User');

describe('User Controller', () => {
  let mockRequest;
  let mockResponse;
  let mockUser;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup mock request object
    mockRequest = {
      user: { id: new mongoose.Types.ObjectId().toString() },
      body: {},
      params: {}
    };

    // Setup mock response object
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Setup mock user data
    mockUser = {
      _id: mockRequest.user.id,
      email: 'test@example.com',
      name: 'Test User',
      preferences: {
        notifications: {
          email: true,
          push: true
        },
        theme: 'light'
      },
      save: jest.fn().mockResolvedValue(true),
      toObject: jest.fn().mockReturnThis()
    };
  });

  describe('getUserProfile', () => {
    it('should get user profile successfully', async () => {
      // Setup the mock implementation for this specific test
      const mockQueryChain = {
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockUser)
      };
      User.findById.mockReturnValue(mockQueryChain);

      await UserController.getUserProfile(mockRequest, mockResponse);

      expect(User.findById).toHaveBeenCalledWith(mockRequest.user.id);
      expect(mockQueryChain.select).toHaveBeenCalledWith('-password');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'User profile retrieved successfully',
        data: mockUser
      });
    });

    it('should handle user not found', async () => {
      const mockQueryChain = {
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null)
      };
      User.findById.mockReturnValue(mockQueryChain);

      await UserController.getUserProfile(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'User not found'
      });
    });

    it('should handle database errors', async () => {
      const mockQueryChain = {
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockRejectedValue(new Error('Database error'))
      };
      User.findById.mockReturnValue(mockQueryChain);

      await UserController.getUserProfile(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Failed to retrieve user profile'
      });
    });
  });

  describe('updateUserProfile', () => {
    it('should update profile successfully', async () => {
      mockRequest.body = {
        name: 'Updated Name',
        email: 'updated@example.com',
        preferences: {
          theme: 'dark'
        }
      };

      const updatedUser = {
        ...mockUser,
        ...mockRequest.body
      };

      User.findById.mockResolvedValue({
        ...updatedUser,
        save: jest.fn().mockResolvedValue(updatedUser)
      });

      await UserController.updateUserProfile(mockRequest, mockResponse);

      expect(User.findById).toHaveBeenCalledWith(mockRequest.user.id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Profile updated successfully',
        data: expect.objectContaining({
          name: 'Updated Name',
          email: 'updated@example.com',
          preferences: expect.objectContaining({
            theme: 'dark'
          })
        })
      });
    });

    it('should reject invalid updates', async () => {
      mockRequest.body = {
        invalidField: 'test',
        role: 'admin' // Attempting to update restricted field
      };

      await UserController.updateUserProfile(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid updates'
      });
    });

    it('should handle validation errors', async () => {
      mockRequest.body = {
        email: 'invalid-email'
      };

      User.findById.mockResolvedValue({
        ...mockUser,
        save: jest.fn().mockRejectedValue(new ValidationError('Invalid email format'))
      });

      await UserController.updateUserProfile(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid email format'
      });
    });
  });

  describe('updateUserPreferences', () => {
    it('should update preferences successfully', async () => {
      mockRequest.body = {
        notifications: {
          email: false,
          push: true
        },
        theme: 'dark'
      };

      const updatedUser = {
        ...mockUser,
        preferences: mockRequest.body
      };

      User.findById.mockResolvedValue({
        ...updatedUser,
        save: jest.fn().mockResolvedValue(updatedUser)
      });

      await UserController.updateUserPreferences(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Preferences updated successfully',
        data: mockRequest.body
      });
    });
  });

  describe('deleteUserProfile', () => {
    it('should delete user successfully', async () => {
      User.findByIdAndDelete.mockResolvedValue(mockUser);

      await UserController.deleteUserProfile(mockRequest, mockResponse);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith(mockRequest.user.id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Profile deleted successfully'
      });
    });

    it('should handle user not found', async () => {
      User.findByIdAndDelete.mockResolvedValue(null);

      await UserController.deleteUserProfile(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'User not found'
      });
    });
  });
});