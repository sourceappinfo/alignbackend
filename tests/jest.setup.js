// tests/jest.setup.js

const { connect, closeDatabase, clearDatabase } = require('../config/test-db');

// Increase timeout for database operations
jest.setTimeout(30000);

// Connect to the in-memory database before all tests
beforeAll(async () => {
  await connect();
});

// Clear database after each test
afterEach(async () => {
  await clearDatabase();
});

// Close database connection after all tests
afterAll(async () => {
  await closeDatabase();
});