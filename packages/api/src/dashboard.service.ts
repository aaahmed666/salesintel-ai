import { mocksEnabled } from '@salesintel/config';
import type { RepDashboardData, ManagerDashboardData, ExecutiveDashboardData } from '@salesintel/types';
import { apiClient, normalizeError } from './client';
import { mockDashboardApi } from './mock';

export interface DashboardService {
  getRepDashboard(): Promise<RepDashboardData>;
  getManagerDashboard(): Promise<ManagerDashboardData>;
  getExecutiveDashboard(): Promise<ExecutiveDashboardData>;
}

async function getRequest<T>(url: string): Promise<T> {
  try {
    const { data } = await apiClient.get<{ data: T }>(url);
    return data.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

const httpDashboardApi: DashboardService = {
  getRepDashboard: () => getRequest('/dashboard/rep'),
  getManagerDashboard: () => getRequest('/dashboard/manager'),
  getExecutiveDashboard: () => getRequest('/dashboard/executive'),
};

export const dashboardService: DashboardService = mocksEnabled ? mockDashboardApi : httpDashboardApi;
