import type { AppUser, BillingInvoice, BillingMetrics, SecurityEvent, SystemAdminSettings } from '@salesintel/types';

export const mockDirectoryUsers: AppUser[] = [
  { id: 'usr-1', name: 'John Doe', email: 'john.doe@company.com', role: 'admin', department: 'Executive', status: 'active', lastLogin: new Date().toISOString() },
  { id: 'usr-2', name: 'Jane Smith', email: 'jane.smith@company.com', role: 'manager', department: 'Sales Operations', status: 'active', lastLogin: new Date(Date.now() - 3600000).toISOString() },
  { id: 'usr-3', name: 'Bob Johnson', email: 'bob.johnson@company.com', role: 'sales_rep', department: 'US Sales', status: 'active', lastLogin: new Date(Date.now() - 86400000).toISOString() },
  { id: 'usr-4', name: 'Alice Williams', email: 'alice.williams@company.com', role: 'sales_rep', department: 'APAC Sales', status: 'invited' },
  { id: 'usr-5', name: 'Charlie Brown', email: 'charlie.brown@company.com', role: 'sales_rep', department: 'EU Sales', status: 'deactivated', lastLogin: new Date(Date.now() - 86400000 * 5).toISOString() },
];

export const mockInvoices: BillingInvoice[] = [
  { id: 'inv-1', amount: 2490.00, date: '2024-06-01T00:00:00Z', status: 'paid', downloadUrl: '#' },
  { id: 'inv-2', amount: 2490.00, date: '2024-05-01T00:00:00Z', status: 'paid', downloadUrl: '#' },
  { id: 'inv-3', amount: 2490.00, date: '2024-04-01T00:00:00Z', status: 'paid', downloadUrl: '#' },
];

export const mockBillingMetrics: BillingMetrics = {
  meetingsProcessed: 840,
  meetingsLimit: 1000,
  aiUsagePercent: 78,
  storageUsageGb: 42.5,
  storageLimitGb: 100,
  activeUsers: 14,
  activeUsersLimit: 20,
};

export const mockSecurityEvents: SecurityEvent[] = [
  { id: 'evt-1', user: 'John Doe', timestamp: new Date().toISOString(), eventType: 'API Key Created', severity: 'info', ipAddress: '192.168.1.1', details: 'Created API Key: Production Read-Only' },
  { id: 'evt-2', user: 'Jane Smith', timestamp: new Date(Date.now() - 60000 * 10).toISOString(), eventType: 'Failed Login Attempt', severity: 'warning', ipAddress: '192.168.1.5', details: 'Failed password login attempt' },
  { id: 'evt-3', user: 'System Worker', timestamp: new Date(Date.now() - 3600000).toISOString(), eventType: 'Webhook Delivery Failed', severity: 'critical', ipAddress: '10.0.0.8', details: 'Failed to deliver webhook to endpoint' },
  { id: 'evt-4', user: 'John Doe', timestamp: new Date(Date.now() - 86400000).toISOString(), eventType: 'MFA Policies Updated', severity: 'critical', ipAddress: '192.168.1.1', details: 'Required multi-factor authentication toggled to true' },
];

export const mockAdminSettings: SystemAdminSettings = {
  org: {
    name: 'CloudScale Technologies Inc.',
    taxId: 'US-92-12839123',
    billingEmail: 'billing@cloudscale.io',
    address: '100 Pine St, San Francisco, CA 94111',
  },
  branding: {
    logoUrl: '',
    primaryColor: '#4648d4',
    accentColor: '#8455ef',
    companyName: 'CloudScale',
  },
  email: {
    senderName: 'SalesForce AI Notifications',
    senderEmail: 'no-reply@salesforce-ai.io',
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587,
  },
  security: {
    requireMfa: true,
    passwordMinLength: 12,
    sessionTimeoutMinutes: 60,
  },
  notifications: {
    emailAlerts: true,
    slackAlerts: true,
    webhookAlerts: false,
  },
};
