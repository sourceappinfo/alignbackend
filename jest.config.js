// jest.config.js

module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    moduleFileExtensions: ['js', 'json'],
    verbose: true,
    collectCoverage: true,
    coverageDirectory: './coverage',
    setupFilesAfterEnv: ['./tests/jest.setup.js'],
    testTimeout: 30000,
    clearMocks: true,
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/tests/',
      '/config/',
      'jest.config.js'
    ],
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    },
    detectOpenHandles: true,
    // Add this to properly handle MongoDB memory server
    testEnvironmentOptions: {
      NODE_ENV: 'test'
    }
  };