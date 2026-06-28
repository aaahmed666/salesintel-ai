import type { ApiKey, Webhook, WebhookLog } from '@salesintel/types';
import { mockDeveloperApi } from './mock/developer.mock';

export const developerService = {
  // API Keys
  async getApiKeys(): Promise<ApiKey[]> {
    return mockDeveloperApi.getApiKeys();
  },

  async createApiKey(name: string): Promise<ApiKey> {
    return mockDeveloperApi.createApiKey(name);
  },

  async revokeApiKey(id: string): Promise<ApiKey> {
    return mockDeveloperApi.revokeApiKey(id);
  },

  // Webhooks
  async getWebhooks(): Promise<Webhook[]> {
    return mockDeveloperApi.getWebhooks();
  },

  async createWebhook(url: string, description: string, events: string[]): Promise<Webhook> {
    return mockDeveloperApi.createWebhook(url, description, events);
  },

  async editWebhook(id: string, url: string, description: string, events: string[], status: 'active' | 'inactive'): Promise<Webhook> {
    return mockDeveloperApi.editWebhook(id, url, description, events, status);
  },

  async deleteWebhook(id: string): Promise<boolean> {
    return mockDeveloperApi.deleteWebhook(id);
  },

  // Logs
  async getWebhookLogs(): Promise<WebhookLog[]> {
    return mockDeveloperApi.getWebhookLogs();
  },

  async retryWebhookDelivery(logId: string): Promise<WebhookLog> {
    return mockDeveloperApi.retryWebhookDelivery(logId);
  },
};
