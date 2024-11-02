// tests/models/User.test.js

const mongoose = require('mongoose');
const { connect, closeDatabase, clearDatabase } = require('../../config/test-db');
const User = require('../../models/User');

describe('User Model', () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('Validation', () => {
    it('should validate required fields', async () => {
      const user = new User({});
      
      let error;
      try {
        await user.validate();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    it('should validate email format', async () => {
      const user = new User({
        email: 'invalid-email',
        password: 'password123'
      });

      let error;
      try {
        await user.validate();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.email.message).toBe('Please provide a valid email');
    });

    it('should hash password before saving', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123'
      });

      await user.save();
      expect(user.password).not.toBe('password123');
      expect(user.password).toHaveLength(60); // bcrypt hash length
    });
  });

  describe('Methods', () => {
    it('should compare password correctly', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123'
      });

      await user.save();
      const isMatch = await user.comparePassword('password123');
      const isNotMatch = await user.comparePassword('wrongpassword');

      expect(isMatch).toBe(true);
      expect(isNotMatch).toBe(false);
    });

    it('should generate auth token', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123'
      });

      await user.save();
      const token = user.generateAuthToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });
});