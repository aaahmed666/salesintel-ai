'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSettingsService, queryKeys, mutationKeys } from '@salesintel/api';
import type { ApiError, SystemAdminSettings } from '@salesintel/types';

export function useSystemAdminSettings() {
  return useQuery<SystemAdminSettings, ApiError>({
    queryKey: queryKeys.adminSettings.settings(),
    queryFn: () => adminSettingsService.getSettings(),
  });
}

export function useUpdateSystemAdminSettings() {
  const queryClient = useQueryClient();
  return useMutation<SystemAdminSettings, ApiError, Partial<SystemAdminSettings>>({
    mutationKey: mutationKeys.adminSettings.update,
    mutationFn: (settings) => adminSettingsService.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSettings.settings() });
    },
  });
}
