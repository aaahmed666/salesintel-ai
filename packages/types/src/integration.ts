import type { ID, ISODateString } from './common';

export type IntegrationId = 'zoom' | 'salesforce' | 'hubspot' | 'google-calendar' | 'outlook-calendar' | 'gmail' | 'outlook-email';
export type IntegrationCategory = 'zoom' | 'crm' | 'calendar' | 'email';
export type IntegrationStatus = 'connected' | 'disconnected' | 'error';
export type IntegrationHealthStatus = 'healthy' | 'degraded' | 'offline';

export interface SyncHistoryItem {
  id: ID;
  status: 'success' | 'failed';
  recordCount: number;
  timestamp: ISODateString;
  errorMessage?: string;
}

export interface IntegrationSettings {
  syncFrequencyMinutes?: number;
  selectedCalendars?: string[];
  crmPipelineSync?: boolean;
  importedFolders?: string[];
}

export interface Integration {
  id: IntegrationId;
  name: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  healthStatus: IntegrationHealthStatus;
  lastSyncedAt?: ISODateString;
  settings: IntegrationSettings;
  history: SyncHistoryItem[];
  icon: string;
}
