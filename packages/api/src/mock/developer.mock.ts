import type { ApiKey, Webhook, WebhookLog } from '@salesintel/types';
import { delay } from './db';
import { mockApiKeys, mockWebhooks, mockWebhookLogs } from './developer.data';

export const mockDeveloperApi = {
  // API Keys
  async getApiKeys(): Promise<ApiKey[]> {
    await delay(200);
    return [...mockApiKeys];
  },

  async createApiKey(name: string): Promise<ApiKey> {
    await delay(300);
    const suffix = Math.random().toString(36).substring(2, 10).toUpperCase();
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name,
      prefix: 'sk_live_51M...',
      secretValue: `sk_live_51Mzk3dF8zJnW2p5xQ8z91xY2bA7cE4gD${suffix}`,
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    mockApiKeys.unshift(newKey);
    return { ...newKey };
  },

  async revokeApiKey(id: string): Promise<ApiKey> {
    await delay(200);
    const key = mockApiKeys.find((k) => k.id === id);
    if (!key) throw new Error('API Key not found');
    key.status = 'revoked';
    return { ...key };
  },

  // Webhooks
  async getWebhooks(): Promise<Webhook[]> {
    await delay(250);
    return [...mockWebhooks];
  },

  async createWebhook(url: string, description: string, events: string[]): Promise<Webhook> {
    await delay(300);
    const newWebhook: Webhook = {
      id: `wh-${Date.now()}`,
      url,
      description,
      events,
      secret: `whsec_${Math.random().toString(36).substring(2, 18)}`,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    mockWebhooks.push(newWebhook);
    return { ...newWebhook };
  },

  async editWebhook(id: string, url: string, description: string, events: string[], status: 'active' | 'inactive'): Promise<Webhook> {
    await delay(200);
    const wh = mockWebhooks.find((w) => w.id === id);
    if (!wh) throw new Error('Webhook not found');
    wh.url = url;
    wh.description = description;
    wh.events = events;
    wh.status = status;
    return { ...wh };
  },

  async deleteWebhook(id: string): Promise<boolean> {
    await delay(200);
    const idx = mockWebhooks.findIndex((w) => w.id === id);
    if (idx === -1) throw new Error('Webhook not found');
    mockWebhooks.splice(idx, 1);
    return true;
  },

  // Logs
  async getWebhookLogs(): Promise<WebhookLog[]> {
    await delay(300);
    return [...mockWebhookLogs];
  },

  async retryWebhookDelivery(logId: string): Promise<WebhookLog> {
    await delay(400);
    const log = mockWebhookLogs.find((l) => l.id === logId);
    if (!log) throw new Error('Log not found');
    // Simulate successful retry
    log.status = 'success';
    log.statusCode = 200;
    log.responseBody = JSON.stringify({ retrySuccess: true, timestamp: new Date().toISOString() }, null, 2);
    return { ...log };
  },
};
