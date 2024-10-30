const User = require('../../models/User');
const userController = require('../../controllers/userController');
const { formatSuccessResponse, formatErrorResponse } = require('../../utils/responseFormatter');
const { ValidationError } = require('../../utils/errorTypes');

jest.mock('../../models/User');

describe('User Controller', () => {
  let mockUser;
  let req;
  let res;

  beforeEach(() => {
    mockUser = {
      _id: 'mockUserId',
      email: 'test@example.com',
      name: 'Test User',
      preferences: {
        notifications: {
          email: true,
          push: true
        },
        theme: 'light'
      }
    };

    req = {
      user: { id: 'mockUserId' },
      body: {},
      params: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should get user profile successfully', async () => {
      const mockQueryChain = {
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockUser)
      };
      
      User.findById.mockReturnValue(mockQueryChain);

      await userController.getUserProfile(req, res);

      expect(User.findById).toHaveBeenCalledWith('mockUserId');
      expect(mockQueryChain.select).toHaveBeenCalledWith('-password');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        formatSuccessResponse('User profile retrieved successfully', mockUser)
      );
    });

    it('should handle user not found', async () => {
      const mockQueryChain = {
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null)
      };
      
      User.findById.mockReturnValue(mockQueryChain);

      await userController.getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        formatErrorResponse('User not found')
      );
    });

    it('should handle database errors', async () => {
      const mockQueryChain = {
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockRejectedValue(new Error('Database error'))
      };
      
      User.findById.mockReturnValue(mockQueryChain);

      await userController.getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        formatErrorResponse('Failed to retrieve user profile')
      );
    });
  });

  describe('updateUserProfile', () => {
    beforeEach(() => {
      req.body = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };
    });

    it('should update profile successfully', async () => {
      const updatedUser = { ...mockUser, ...req.body };
      User.findById.mockResolvedValue({
        ...mockUser,
        save: jest.fn().mockResolvedValue(updatedUser)
      });

      await userController.updateUserProfile(req, res);

      expect(User.findById).toHaveBeenCalledWith('mockUserId');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        formatSuccessResponse('Profile updated successfully', updatedUser)
      );
    });

    it('should validate allowed updates', async () => {
      req.body.invalidField = 'invalid';

      await userController.updateUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        formatErrorResponse('Invalid updates')
      );
    });

    it('should handle validation errors', async () => {
      const mockUser = {
        ...mockUser,
        save: jest.fn().mockRejectedValue(new ValidationError('Invalid email format'))
      };
      User.findById.mockResolvedValue(mockUser);

      await userController.updateUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        formatErrorResponse('Invalid email format')
      );
    });
  });

  describe('updateUserPreferences', () => {
    beforeEach(() => {
      req.body = {
        notifications: {
          email: false,
          push: true
        },
        theme: 'dark'
      };
    });

    it('should update preferences successfully', async () => {
      const updatedUser = {
        ...mockUser,
        preferences: req.body,
        save: jest.fn().mockResolvedValue({ ...mockUser, preferences: req.body })
      };
      User.findById.mockResolvedValue(updatedUser);

      await userController.updateUserPreferences(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        formatSuccessResponse('Preferences updated successfully', req.body)
      );
    });

    it('should handle partial preference updates', async () => {
      req.body = { theme: 'dark' };
      const updatedPreferences = {
        ...mockUser.preferences,
        theme: 'dark'
      };
      
      const updatedUser = {
        ...mockUser,
        preferences: updatedPreferences,
        save: jest.fn().mockResolvedValue({ ...mockUser, preferences: updatedPreferences })
      };
      User.findById.mockResolvedValue(updatedUser);

      await userController.updateUserPreferences(req, res);

      expect(res.json).toHaveBeenCalledWith(
        formatSuccessResponse('Preferences updated successfully', updatedPreferences)
      );
    });
  });

  describe('deleteUserProfile', () => {
    it('should delete user successfully', async () => {
      User.findByIdAndDelete.mockResolvedValue(mockUser);

      await userController.deleteUserProfile(req, res);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith('mockUserId');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        formatSuccessResponse('Profile deleted successfully')
      );
    });

    it('should handle user not found', async () => {
      User.findByIdAndDelete.mockResolvedValue(null);

      await userController.deleteUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        formatErrorResponse('User not found')
      );
    });
  });
});