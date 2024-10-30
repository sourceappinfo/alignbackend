const fs = require('fs');
const path = require('path');

const filesToExtract = [
    // Core Configuration
    'jest.config.js',
    'tests/jest.setup.js',
    'app.js',
    '.env',
    'config/cacheConfig.js',
    'config/apiRateLimiter.js',
    'package.json',
    'server.js',
    'config/db.js',
    'config/test-db.js',
    'scripts/fetch_sec_data.py',

    // Models with Issues
    'models/User.js',
    'models/Company.js',
    'models/Survey.js',
    'models/Product.js',
    'models/Comment.js',
    'models/Recommendation.js',
    'models/Notification.js',

    // Controllers with Failing Tests
    'controllers/notificationController.js',
    'controllers/recommendationController.js',
    'controllers/imageRecognitionController.js',
    'controllers/searchController.js',
    'controllers/userController.js',
    'controllers/surveyController.js',
    'controllers/authController.js',
    'controllers/companyController.js',

    // Services with Issues
    'services/notificationService.js',
    'services/recommendationService.js',
    'services/cacheService.js',
    'services/authService.js',
    'services/surveyService.js',
    'services/secService.js',
    'services/imageRecognitionService.js',
    'services/searchService.js',
    'services/companyService.js',

    // Middleware
    'middleware/rateLimiter.js',
    'middleware/errorHandler.js',
    'middleware/authMiddleware.js',
    'middleware/validationMiddleware.js',

    // Utils
    'utils/responseFormatter.js',
    'utils/logger.js',
    'utils/errorTypes.js',
    'utils/apiUtils.js',
    'utils/imageProcessingUtils.js',
    'utils/googleVisionConfig.js',

    // Routes
    'routes/notifications.js',
    'routes/recommendations.js',
    'routes/imageRecognition.js',
    'routes/search.js',
    'routes/user.js',
    'routes/survey.js',
    'routes/auth.js',
    'routes/company.js',

    // Models
    'models/User.js',
    'models/Company.js',
    'models/Survey.js',
    'models/Product.js',
    'models/Comment.js',
    'models/Recommendation.js',
    'models/Notification.js',

    // Notifications
    'notifications/notificationService.js',


    // Tests
    'tests/models/Comment.test.js',
    'tests/models/User.test.js',
    'tests/models/Company.test.js',
    'tests/models/Survey.test.js',
    'tests/models/Recommendation.test.js',
    'tests/controllers/notificationController.test.js',
    'tests/controllers/recommendationController.test.js',
    'tests/controllers/userController.test.js',
    'tests/controllers/surveyController.test.js',
    'tests/controllers/authController.test.js',
    'tests/controllers/companyController.test.js',
    'tests/services/authService.test.js',
    'tests/services/surveyService.test.js',
    'tests/services/notificationService.test.js',
    'tests/services/recommendationService.test.js',
    'tests/services/cacheService.test.js',
    'tests/services/companyService.test.js',
    'tests/middleware/rateLimiter.test.js',
    'tests/middleware/errorHandler.test.js',
    'tests/middleware/authMiddleware.test.js',
    'tests/middleware/validationMiddleware.test.js',
    'tests/utils/responseFormatter.test.js',
    'tests/utils/errorTypes.test.js',
    'tests/utils/logger.test.js'
];

const outputFile = path.join(process.env.HOME, 'Desktop', 'align-backend-files.txt');

let outputContent = '';

// Add file contents with clear separators
filesToExtract.forEach(filePath => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        outputContent += '\n\n' + '='.repeat(80) + '\n';
        outputContent += `FILE: ${filePath}\n`;
        outputContent += '='.repeat(80) + '\n\n';
        outputContent += content;
        console.log(`Extracted: ${filePath}`);
    } catch (error) {
        outputContent += `\nError extracting ${filePath}: ${error.message}\n`;
        console.error(`Error extracting ${filePath}:`, error.message);
    }
});

// Write the consolidated content to a single file
fs.writeFileSync(outputFile, outputContent);

console.log('\nAll file contents have been extracted to:', outputFile);
console.log('\nThis file contains all the necessary code to fix:');
console.log('1. MongoDB connection in tests');
console.log('2. Controller response issues');
console.log('3. Test mocking setup');
console.log('4. Service implementations');
console.log('5. Validation problems');