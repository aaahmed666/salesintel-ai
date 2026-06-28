'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService, queryKeys } from '@salesintel/api';
import type { ApiError, RepDashboardData, ManagerDashboardData, ExecutiveDashboardData } from '@salesintel/types';

export function useRepDashboard() {
  return useQuery<RepDashboardData, ApiError>({
    queryKey: queryKeys.dashboard.rep(),
    queryFn: () => dashboardService.getRepDashboard(),
  });
}

export function useManagerDashboard() {
  return useQuery<ManagerDashboardData, ApiError>({
    queryKey: queryKeys.dashboard.manager(),
    queryFn: () => dashboardService.getManagerDashboard(),
  });
}

export function useExecutiveDashboard() {
  return useQuery<ExecutiveDashboardData, ApiError>({
    queryKey: queryKeys.dashboard.executive(),
    queryFn: () => dashboardService.getExecutiveDashboard(),
  });
}
