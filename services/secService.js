// src/services/secService.js
const axios = require('axios');
const config = require('../config');

class SECService {
  constructor() {
    this.baseUrl = 'https://data.sec.gov/api';
    this.userAgent = config.SEC_USER_AGENT;
  }

  async getCompanyProfile(cik) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/submissions/CIK${cik}.json`,
        {
          headers: {
            'User-Agent': this.userAgent
          }
        }
      );
      return this.processCompanyProfile(response.data);
    } catch (error) {
      console.error('Error fetching SEC data:', error);
      throw error;
    }
  }

  async getFinancialData(cik) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/xbrl/companyfacts/CIK${cik}.json`,
        {
          headers: {
            'User-Agent': this.userAgent
          }
        }
      );
      return this.processFinancialData(response.data);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      throw error;
    }
  }

  processCompanyProfile(data) {
    return {
      name: data.name,
      cik: data.cik,
      sic: data.sic,
      sicDescription: data.sicDescription,
      employees: data.employees,
      addresses: data.addresses
    };
  }

  processFinancialData(data) {
    // Extract relevant financial metrics
    const facts = data.facts['us-gaap'];
    return {
      revenue: this.getLatestValue(facts.Revenues),
      netIncome: this.getLatestValue(facts.NetIncomeLoss),
      totalAssets: this.getLatestValue(facts.Assets),
      totalLiabilities: this.getLatestValue(facts.Liabilities)
    };
  }

  getLatestValue(metric) {
    if (!metric || !metric.units || !metric.units.USD) return null;
    const values = metric.units.USD;
    return values.reduce((latest, current) => {
      return (!latest || new Date(current.end) > new Date(latest.end))
        ? current
        : latest;
    }, null);
  }
}

module.exports = new SECService();