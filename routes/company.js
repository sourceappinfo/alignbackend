const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, companyController.getAllCompanies);
router.get('/:id', authMiddleware, companyController.getCompanyById);
router.patch('/:id', authMiddleware, companyController.updateCompany);

module.exports = router;
