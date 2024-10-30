const mongoose = require('mongoose');
const Company = require('../../models/Company');

describe('Company Model', () => {
  it('should create a company with valid data', async () => {
    const companyData = {
      name: 'Test Company',
      cik: '0001234567',
      ticker: 'TEST',
      industry: 'Technology'
    };

    const company = new Company(companyData);
    await company.validate();
    
    expect(company.name).toBe(companyData.name);
    expect(company.cik).toBe(companyData.cik);
  });

  it('should require name and cik', async () => {
    const company = new Company({});
    await expect(company.validate()).rejects.toThrow();
  });
});