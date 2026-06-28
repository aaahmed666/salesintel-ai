import type { AppUser, BillingInvoice, BillingMetrics, SecurityEvent, SystemAdminSettings } from '@salesintel/types';
import { delay } from './db';
import { mockDirectoryUsers, mockInvoices, mockBillingMetrics, mockSecurityEvents, mockAdminSettings } from './admin-settings.data';

export const mockAdminSettingsApi = {
  // Users
  async getUsers(): Promise<AppUser[]> {
    await delay(200);
    return [...mockDirectoryUsers];
  },

  async createUser(input: Omit<AppUser, 'id' | 'status'>): Promise<AppUser> {
    await delay(300);
    const newUser: AppUser = {
      id: `usr-${Date.now()}`,
      ...input,
      status: 'invited',
    };
    mockDirectoryUsers.push(newUser);
    return { ...newUser };
  },

  async updateUser(id: string, input: Partial<Omit<AppUser, 'id'>>): Promise<AppUser> {
    await delay(200);
    const idx = mockDirectoryUsers.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('User not found');
    mockDirectoryUsers[idx] = { ...mockDirectoryUsers[idx], ...input } as AppUser;
    return { ...mockDirectoryUsers[idx] };
  },

  async deactivateUser(id: string): Promise<AppUser> {
    await delay(200);
    const user = mockDirectoryUsers.find((u) => u.id === id);
    if (!user) throw new Error('User not found');
    user.status = 'deactivated';
    return { ...user };
  },

  // Billing
  async getBillingInvoices(): Promise<BillingInvoice[]> {
    await delay(200);
    return [...mockInvoices];
  },

  async getBillingMetrics(): Promise<BillingMetrics> {
    await delay(250);
    return { ...mockBillingMetrics };
  },

  // Security Audit Logs
  async getSecurityEvents(): Promise<SecurityEvent[]> {
    await delay(300);
    return [...mockSecurityEvents];
  },

  // Settings
  async getSettings(): Promise<SystemAdminSettings> {
    await delay(200);
    return { ...mockAdminSettings };
  },

  async updateSettings(settings: Partial<SystemAdminSettings>): Promise<SystemAdminSettings> {
    await delay(300);
    if (settings.org) mockAdminSettings.org = { ...mockAdminSettings.org, ...settings.org };
    if (settings.branding) mockAdminSettings.branding = { ...mockAdminSettings.branding, ...settings.branding };
    if (settings.email) mockAdminSettings.email = { ...mockAdminSettings.email, ...settings.email };
    if (settings.security) mockAdminSettings.security = { ...mockAdminSettings.security, ...settings.security };
    if (settings.notifications) mockAdminSettings.notifications = { ...mockAdminSettings.notifications, ...settings.notifications };
    return { ...mockAdminSettings };
  },
};
