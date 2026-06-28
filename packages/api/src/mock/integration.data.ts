import type { Integration } from '@salesintel/types';

export const mockIntegrations: Integration[] = [
  {
    id: 'zoom',
    name: 'Zoom Video Communications',
    category: 'zoom',
    status: 'connected',
    healthStatus: 'healthy',
    lastSyncedAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hrs ago
    settings: {
      syncFrequencyMinutes: 30,
    },
    icon: 'video_camera_front',
    history: [
      { id: 'sh-1', status: 'success', recordCount: 4, timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
      { id: 'sh-2', status: 'success', recordCount: 2, timestamp: new Date(Date.now() - 3600000 * 4).toISOString() },
      { id: 'sh-3', status: 'failed', recordCount: 0, timestamp: new Date(Date.now() - 3600000 * 6).toISOString(), errorMessage: 'API Limit Exceeded' },
    ],
  },
  {
    id: 'salesforce',
    name: 'Salesforce CRM',
    category: 'crm',
    status: 'disconnected',
    healthStatus: 'offline',
    settings: {
      crmPipelineSync: true,
    },
    icon: 'cloud_sync',
    history: [],
  },
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    category: 'crm',
    status: 'connected',
    healthStatus: 'healthy',
    lastSyncedAt: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hr ago
    settings: {
      crmPipelineSync: true,
    },
    icon: 'hub',
    history: [
      { id: 'sh-hs-1', status: 'success', recordCount: 12, timestamp: new Date(Date.now() - 3600000 * 1).toISOString() },
    ],
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar Sync',
    category: 'calendar',
    status: 'connected',
    healthStatus: 'degraded',
    lastSyncedAt: new Date(Date.now() - 60000 * 15).toISOString(), // 15 mins ago
    settings: {
      selectedCalendars: ['primary', 'sales-team'],
    },
    icon: 'calendar_today',
    history: [
      { id: 'sh-gc-1', status: 'success', recordCount: 8, timestamp: new Date(Date.now() - 60000 * 15).toISOString() },
      { id: 'sh-gc-2', status: 'failed', recordCount: 0, timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), errorMessage: 'OAuth Token Expired' },
    ],
  },
  {
    id: 'gmail',
    name: 'Gmail Message Feed',
    category: 'email',
    status: 'disconnected',
    healthStatus: 'offline',
    settings: {
      importedFolders: ['Inbox', 'Sent'],
    },
    icon: 'mail',
    history: [],
  },
];
