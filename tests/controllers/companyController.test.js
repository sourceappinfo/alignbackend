// tests/controllers/companyController.test.js
const companyController = require('../../controllers/companyController');
const Company = require('../../models/Company');
const SECService = require('../../services/secService');

jest.mock('../../models/Company');
jest.mock('../../services/secService'); // Mock SECService

describe('Company Controller', () => {
  it('should update company data', async () => {
    const cik = '0001234567';
    const mockProfile = {
      name: 'Test Company',
      cik: '0001234567',
      sic: '1234',
      sicDescription: 'Description',
      employees: 100,
      addresses: [],
    };

    // Mock the SECService method
    SECService.getCompanyProfile.mockResolvedValue(mockProfile);
    
    const mockCompany = {
      cik,
      ...mockProfile,
      lastUpdated: new Date()
    };

    Company.findOneAndUpdate.mockResolvedValue(mockCompany); // Mock Company update

    const result = await companyController.updateCompanyData(cik);
    
    expect(result).toEqual(expect.objectContaining({ cik: '0001234567', name: 'Test Company' }));
  });
});
