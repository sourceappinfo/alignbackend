// tests/jest.setup.js
const dbHandler = require('../config/test-db'); // Adjust path if necessary

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());
