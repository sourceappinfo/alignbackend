const authService = require('../../services/authService');

describe('Auth Service', () => {
  it('should create a new user', async () => {
    const user = await authService.register({ email: 'test@example.com', password: 'password123' });
    expect(user).toHaveProperty('email', 'test@example.com');
  });

  it('should validate a user login', async () => {
    const token = await authService.login('test@example.com', 'password123');
    expect(token).toBeTruthy();
  });
});
