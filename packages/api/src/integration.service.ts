import type { Integration, IntegrationId } from '@salesintel/types';
import { mockIntegrationApi } from './mock/integration.mock';

export const integrationService = {
  async getIntegrations(): Promise<Integration[]> {
    return mockIntegrationApi.getIntegrations();
  },

  async connectIntegration(id: IntegrationId): Promise<Integration> {
    return mockIntegrationApi.connectIntegration(id);
  },

  async disconnectIntegration(id: IntegrationId): Promise<Integration> {
    return mockIntegrationApi.disconnectIntegration(id);
  },

  async updateIntegrationSettings(id: IntegrationId, settings: any): Promise<Integration> {
    return mockIntegrationApi.updateIntegrationSettings(id, settings);
  },
};
