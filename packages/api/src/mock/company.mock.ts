import type { Company, SubscriptionPlan, CompanyStatus } from '@salesintel/types';
import { delay } from './db';
import { mockCompanies } from './company.data';

export const mockCompanyApi = {
  async getCompanies(): Promise<Company[]> {
    await delay(300);
    return [...mockCompanies];
  },

  async createCompany(input: Omit<Company, 'id' | 'createdAt'>): Promise<Company> {
    await delay(400);
    const newCompany: Company = {
      id: `comp-${Date.now()}`,
      ...input,
      createdAt: new Date().toISOString(),
    };
    mockCompanies.unshift(newCompany);
    return { ...newCompany };
  },

  async updateCompany(id: string, input: Partial<Omit<Company, 'id' | 'createdAt'>>): Promise<Company> {
    await delay(300);
    const idx = mockCompanies.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Company not found');
    const company = mockCompanies[idx];
    if (!company) throw new Error('Company not found');
    const updated = {
      ...company,
      ...input,
    };
    mockCompanies[idx] = updated;
    return { ...updated };
  },
};
