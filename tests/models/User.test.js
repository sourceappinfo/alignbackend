// tests/models/User.test.js
const User = require('../../models/User');

describe('User Model', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should hash the password before saving', async () => {
    const user = new User({ 
      email: 'test@example.com', 
      password: 'password123' 
    });
    await user.save();
    expect(user.password).not.toBe('password123');
  });

  it('should validate password comparison correctly', async () => {
    const user = new User({ 
      email: 'test@example.com', 
      password: 'password123' 
    });
    await user.save();
    const isMatch = await user.comparePassword('password123');
    expect(isMatch).toBe(true);
  });

  describe('Additional Methods', () => {
    it('should update last login time', async () => {
      const user = new User({ 
        email: 'test@example.com', 
        password: 'password123' 
      });
      await user.save();
      
      const beforeUpdate = user.lastLogin;
      await user.updateLastLogin();
      expect(user.lastLogin).not.toEqual(beforeUpdate);
    });

    it('should get full name', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      });
      
      expect(user.getFullName()).toBe('John Doe');
    });

    it('should handle missing first or last name', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John'
      });
      
      expect(user.getFullName()).toBe('John');
    });

    it('should handle missing first and last name', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123'
      });
      
      expect(user.getFullName()).toBe('');
    });
  });

  describe('Validation', () => {
    it('should require email', async () => {
      const user = new User({ password: 'password123' });
      await expect(user.validate()).rejects.toThrow();
    });

    it('should require password', async () => {
      const user = new User({ email: 'test@example.com' });
      await expect(user.validate()).rejects.toThrow();
    });

    it('should require valid email format', async () => {
      const user = new User({
        email: 'invalid-email',
        password: 'password123'
      });
      await expect(user.validate()).rejects.toThrow();
    });

    it('should enforce minimum password length', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'short'
      });
      await expect(user.validate()).rejects.toThrow();
    });
  });

  describe('Password Comparison', () => {
    it('should reject incorrect password', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();
      
      const isMatch = await user.comparePassword('wrongpassword');
      expect(isMatch).toBe(false);
    });

    it('should handle comparison error', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123'
      });
      user.password = 'invalid-hash';
      
      await expect(user.comparePassword('password123'))
        .rejects.toThrow('Password comparison failed');
    });
  });
});