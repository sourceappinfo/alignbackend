// jest.config.js
module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    moduleFileExtensions: ['js', 'json'],
    verbose: true, // Single verbose declaration
    collectCoverage: true,
    coverageDirectory: './coverage',
    setupFilesAfterEnv: ['./tests/jest.setup.js'],
    setupFiles: ['dotenv/config'],
    testTimeout: 10000, // Adjust based on environment if needed
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
    forceExit: true
};
