// services/secService.js
const axios = require('axios');
const logger = require('../utils/logger');
require('dotenv').config();

class SECService {
  constructor() {
    this.baseUrl = 'https://data.sec.gov/api';
    this.userAgent = process.env.SEC_USER_AGENT || 'YourDefaultUserAgent';
  }

  async getCompanyProfile(cik) {
    try {
      const url = `${this.baseUrl}/submissions/CIK${cik}.json`;
      logger.info(`Fetching SEC company profile from URL: ${url}`); // Log the URL
      const response = await axios.get(url, {
        headers: { 'User-Agent': this.userAgent },
      });
      return this.processCompanyProfile(response.data);
    } catch (error) {
      logger.error(`Error fetching SEC company profile for CIK ${cik}: ${error.message}`);
      throw new Error('Failed to fetch company profile from SEC');
    }
  }

  processCompanyProfile(data) {
    return {
      name: data.name,
      cik: data.cik,
      sic: data.sic,
      sicDescription: data.sicDescription,
      employees: data.employees,
      addresses: data.addresses,
    };
  }

  // Other methods remain unchanged...
}

module.exports = new SECService();
