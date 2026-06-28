import type { RepDashboardData, ManagerDashboardData, ExecutiveDashboardData } from '@salesintel/types';
import { delay } from './db';
import { mockRepDashboard, mockManagerDashboard, mockExecutiveDashboard } from './dashboard.data';

export const mockDashboardApi = {
  async getRepDashboard(): Promise<RepDashboardData> {
    await delay(250);
    return { ...mockRepDashboard };
  },
  async getManagerDashboard(): Promise<ManagerDashboardData> {
    await delay(250);
    return { ...mockManagerDashboard };
  },
  async getExecutiveDashboard(): Promise<ExecutiveDashboardData> {
    await delay(250);
    return { ...mockExecutiveDashboard };
  },
};
