const mongoose = require('mongoose');
const User = require('../../models/User');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('User Model', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    // Check if already connected before connecting
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoServer.getUri(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('Validation', () => {
    it('should require valid email format', async () => {
      const user = new User({
        email: 'invalid-email',
        password: 'password123',
      });

      await expect(user.validate()).rejects.toThrow(/Please provide a valid email/);
    });

    it('should enforce minimum password length', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'short',
      });

      await expect(user.validate()).rejects.toThrow(/Password must be at least 8 characters/);
    });
  });

  describe('Password Comparison', () => {
    it('should handle comparison error', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
      });

      await user.save();
      user.password = 'invalid-hash';

      await expect(user.comparePassword('password123'))
        .rejects.toThrow('Password comparison failed');
    });
  });
});
