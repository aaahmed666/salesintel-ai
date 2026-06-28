import type { AIProvider, AIProviderId, SystemHealthSummary } from '@salesintel/types';
import { mockAISettingsApi } from './mock/ai-settings.mock';

export const aiSettingsService = {
  async getProviders(): Promise<AIProvider[]> {
    return mockAISettingsApi.getProviders();
  },

  async updateProviderModel(id: AIProviderId, model: string): Promise<AIProvider> {
    return mockAISettingsApi.updateProviderModel(id, model);
  },

  async toggleProviderEnabled(id: AIProviderId, enabled: boolean): Promise<AIProvider> {
    return mockAISettingsApi.toggleProviderEnabled(id, enabled);
  },

  async getSystemHealth(): Promise<SystemHealthSummary> {
    return mockAISettingsApi.getSystemHealth();
  },
};
