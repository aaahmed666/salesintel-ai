import type { AIProvider, AIProviderId, SystemHealthSummary } from '@salesintel/types';
import { delay } from './db';
import { mockAIProviders, mockSystemHealth } from './ai-settings.data';

export const mockAISettingsApi = {
  async getProviders(): Promise<AIProvider[]> {
    await delay(200);
    return [...mockAIProviders];
  },

  async updateProviderModel(id: AIProviderId, model: string): Promise<AIProvider> {
    await delay(300);
    const provider = mockAIProviders.find((p) => p.id === id);
    if (!provider) throw new Error('AI Provider not found');
    provider.activeModel = model;
    return { ...provider };
  },

  async toggleProviderEnabled(id: AIProviderId, enabled: boolean): Promise<AIProvider> {
    await delay(200);
    const provider = mockAIProviders.find((p) => p.id === id);
    if (!provider) throw new Error('AI Provider not found');
    provider.enabled = enabled;
    return { ...provider };
  },

  async getSystemHealth(): Promise<SystemHealthSummary> {
    await delay(400);
    // Add dynamic jitter to queue backlog or usage graph if needed
    const health = { ...mockSystemHealth };
    health.queueBacklog = Math.max(0, health.queueBacklog + (Math.random() > 0.7 ? 1 : Math.random() > 0.7 ? -1 : 0));
    return health;
  },
};
