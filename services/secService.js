// services/secService.js
const axios = require('axios');
const API_BASE_URL = 'https://data.sec.gov/submissions';

async function fetchCompanyData(cik) {
  try {
    const response = await axios.get(`${API_BASE_URL}/CIK${cik}.json`, {
      headers: {
        'User-Agent': 'YourAppName (your.email@example.com)',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for CIK ${cik}:`, error.message);
    throw new Error('Unable to retrieve SEC data.');
  }
}

async function extractFinancialData(cik) {
  const data = await fetchCompanyData(cik);
  const filings = data?.filings?.recent;

  if (!filings) throw new Error('No recent filings found.');

  // Extract some key financial data points
  const revenue = filings.revenue;
  const netIncome = filings.netIncome;
  const assets = filings.assets;
  const liabilities = filings.liabilities;

  return { revenue, netIncome, assets, liabilities };
}

async function extractOwnershipData(cik) {
  const data = await fetchCompanyData(cik);
  const ownership = data?.ownership?.recent;

  if (!ownership) throw new Error('No recent ownership data found.');

  return ownership;
}

module.exports = {
  fetchCompanyData,
  extractFinancialData,
  extractOwnershipData,
};
