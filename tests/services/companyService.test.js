const companyService = require('../../services/companyService');
const Company = require('../../models/Company');

jest.mock('../../models/Company');

describe('Company Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all companies', async () => {
    const mockCompanies = [
      { name: 'Company 1' },
      { name: 'Company 2' }
    ];

    Company.find.mockResolvedValue(mockCompanies);
    const result = await companyService.getAllCompanies();
    expect(result).toEqual(mockCompanies);
  });
});