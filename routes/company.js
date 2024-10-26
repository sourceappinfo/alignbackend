const express = require('express');
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// GET /api/companies
router.get('/', authMiddleware, companyController.getCompanies);

// GET /api/companies/:id
router.get('/:id', authMiddleware, companyController.getCompanyById);

// PUT /api/companies/:id
router.put('/:id', authMiddleware, companyController.updateCompany);

module.exports = router;
