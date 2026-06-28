import type { AppUser, BillingInvoice, BillingMetrics, SecurityEvent, SystemAdminSettings } from '@salesintel/types';
import { mockAdminSettingsApi } from './mock/admin-settings.mock';

export const adminSettingsService = {
  // Users
  async getUsers(): Promise<AppUser[]> {
    return mockAdminSettingsApi.getUsers();
  },

  async createUser(input: Omit<AppUser, 'id' | 'status'>): Promise<AppUser> {
    return mockAdminSettingsApi.createUser(input);
  },

  async updateUser(id: string, input: Partial<Omit<AppUser, 'id'>>): Promise<AppUser> {
    return mockAdminSettingsApi.updateUser(id, input);
  },

  async deactivateUser(id: string): Promise<AppUser> {
    return mockAdminSettingsApi.deactivateUser(id);
  },

  // Billing
  async getBillingInvoices(): Promise<BillingInvoice[]> {
    return mockAdminSettingsApi.getBillingInvoices();
  },

  async getBillingMetrics(): Promise<BillingMetrics> {
    return mockAdminSettingsApi.getBillingMetrics();
  },

  // Security Audit Logs
  async getSecurityEvents(): Promise<SecurityEvent[]> {
    return mockAdminSettingsApi.getSecurityEvents();
  },

  // Settings
  async getSettings(): Promise<SystemAdminSettings> {
    return mockAdminSettingsApi.getSettings();
  },

  async updateSettings(settings: Partial<SystemAdminSettings>): Promise<SystemAdminSettings> {
    return mockAdminSettingsApi.updateSettings(settings);
  },
};
