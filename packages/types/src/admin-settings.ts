import type { ID, ISODateString } from './common';
import type { UserRole } from './auth';
import type { SubscriptionPlan } from './company';

export type DirectoryUserStatus = 'active' | 'deactivated' | 'invited';

export interface AppUser {
  id: ID;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: DirectoryUserStatus;
  lastLogin?: ISODateString;
}

export interface BillingInvoice {
  id: ID;
  amount: number;
  date: ISODateString;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl: string;
}

export interface BillingMetrics {
  meetingsProcessed: number;
  meetingsLimit: number;
  aiUsagePercent: number;
  storageUsageGb: number;
  storageLimitGb: number;
  activeUsers: number;
  activeUsersLimit: number;
}

export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface SecurityEvent {
  id: ID;
  user: string;
  timestamp: ISODateString;
  eventType: string;
  severity: AuditSeverity;
  ipAddress: string;
  details: string;
}

export interface OrganizationInfo {
  name: string;
  taxId?: string;
  billingEmail: string;
  address?: string;
}

export interface BrandingSettings {
  logoUrl?: string;
  primaryColor: string;
  accentColor: string;
  companyName: string;
}

export interface EmailSettings {
  senderName: string;
  senderEmail: string;
  smtpHost?: string;
  smtpPort?: number;
}

export interface SecurityPolicies {
  requireMfa: boolean;
  passwordMinLength: number;
  sessionTimeoutMinutes: number;
}

export interface NotificationPreferences {
  emailAlerts: boolean;
  slackAlerts: boolean;
  webhookAlerts: boolean;
}

export interface SystemAdminSettings {
  org: OrganizationInfo;
  branding: BrandingSettings;
  email: EmailSettings;
  security: SecurityPolicies;
  notifications: NotificationPreferences;
}
