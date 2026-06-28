import type { Integration, IntegrationId } from '@salesintel/types';
import { delay } from './db';
import { mockIntegrations } from './integration.data';

export const mockIntegrationApi = {
  async getIntegrations(): Promise<Integration[]> {
    await delay(300);
    return [...mockIntegrations];
  },

  async connectIntegration(id: IntegrationId): Promise<Integration> {
    await delay(400);
    const item = mockIntegrations.find((i) => i.id === id);
    if (!item) throw new Error('Integration not found');
    item.status = 'connected';
    item.healthStatus = 'healthy';
    item.lastSyncedAt = new Date().toISOString();
    return { ...item };
  },

  async disconnectIntegration(id: IntegrationId): Promise<Integration> {
    await delay(300);
    const item = mockIntegrations.find((i) => i.id === id);
    if (!item) throw new Error('Integration not found');
    item.status = 'disconnected';
    item.healthStatus = 'offline';
    return { ...item };
  },

  async updateIntegrationSettings(id: IntegrationId, settings: any): Promise<Integration> {
    await delay(200);
    const item = mockIntegrations.find((i) => i.id === id);
    if (!item) throw new Error('Integration not found');
    item.settings = { ...item.settings, ...settings };
    return { ...item };
  },
};
