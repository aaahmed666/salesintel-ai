import type { Company } from '@salesintel/types';
import { mockCompanyApi } from './mock/company.mock';

export const companyService = {
  async getCompanies(): Promise<Company[]> {
    return mockCompanyApi.getCompanies();
  },

  async createCompany(input: Omit<Company, 'id' | 'createdAt'>): Promise<Company> {
    return mockCompanyApi.createCompany(input);
  },

  async updateCompany(id: string, input: Partial<Omit<Company, 'id' | 'createdAt'>>): Promise<Company> {
    return mockCompanyApi.updateCompany(id, input);
  },
};
