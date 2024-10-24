const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, companyController.addCompany); // Protected route
router.get('/', companyController.getCompanies);

module.exports = router;
