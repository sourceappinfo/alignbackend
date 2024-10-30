// tests/controllers/userController.test.js
const User = require('../../models/User');
const userController = require('../../controllers/userController');

jest.mock('../../models/User');

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks
  });

  it('should get user profile', async () => {
    const req = { user: { id: 'mockUserId' } }; // Assuming user ID is set here
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const mockUser = { email: 'test@example.com', firstName: 'John', lastName: 'Doe' };
    User.findById.mockResolvedValue(mockUser); // Mock findById

    await userController.getUserProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ user: mockUser }));
  });
});
