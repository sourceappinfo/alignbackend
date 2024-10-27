// scripts/updateCompanyData.js
const initialCompanies = require('../config/initialCompanies');
const { updateCompanyData } = require('../controllers/companyController');
const logger = require('../utils/logger');

async function updateAllCompanies() {
  for (const company of initialCompanies) {
    try {
      logger.info(`Updating data for ${company.name}`);
      await updateCompanyData(company.cik);
      // Add delay to respect SEC API rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      logger.error(`Failed to update ${company.name}:`, error);
    }
  }
}

// Can be run as a script or called from your application
if (require.main === module) {
  updateAllCompanies()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = updateAllCompanies;