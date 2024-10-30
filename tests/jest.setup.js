// tests/jest.setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
  // Clear Mongoose models (optional for complete reset)
  mongoose.models = {};
  mongoose.modelSchemas = {};
});

afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    await Promise.all(
      Object.values(collections).map(collection => collection.deleteMany({}))
    );
  }
});

// Adjust timeout based on environment
if (process.env.CI) {
  jest.setTimeout(100000); // Long timeout for CI environments
} else {
  jest.setTimeout(30000); // Shorter timeout for local development
}
