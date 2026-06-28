'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiSettingsService, queryKeys, mutationKeys } from '@salesintel/api';
import type { ApiError, AIProvider, AIProviderId, SystemHealthSummary } from '@salesintel/types';

export function useAIProviders() {
  return useQuery<AIProvider[], ApiError>({
    queryKey: queryKeys.aiSettings.providers(),
    queryFn: () => aiSettingsService.getProviders(),
  });
}

export function useUpdateProviderModel() {
  const queryClient = useQueryClient();
  return useMutation<AIProvider, ApiError, { id: AIProviderId; model: string }>({
    mutationKey: mutationKeys.aiSettings.updateModel,
    mutationFn: ({ id, model }) => aiSettingsService.updateProviderModel(id, model),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.aiSettings.providers() });
    },
  });
}

export function useToggleProviderEnabled() {
  const queryClient = useQueryClient();
  return useMutation<AIProvider, ApiError, { id: AIProviderId; enabled: boolean }>({
    mutationKey: mutationKeys.aiSettings.toggleProvider,
    mutationFn: ({ id, enabled }) => aiSettingsService.toggleProviderEnabled(id, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.aiSettings.providers() });
    },
  });
}

export function useSystemHealth() {
  return useQuery<SystemHealthSummary, ApiError>({
    queryKey: queryKeys.aiSettings.health(),
    queryFn: () => aiSettingsService.getSystemHealth(),
    refetchInterval: 5000, // Poll health metrics every 5s
  });
}
