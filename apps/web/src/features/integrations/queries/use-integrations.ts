'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { integrationService, queryKeys, mutationKeys } from '@salesintel/api';
import type { ApiError, Integration, IntegrationId } from '@salesintel/types';

export function useIntegrations() {
  return useQuery<Integration[], ApiError>({
    queryKey: queryKeys.integrations.list(),
    queryFn: () => integrationService.getIntegrations(),
  });
}

export function useConnectIntegration() {
  const queryClient = useQueryClient();
  return useMutation<Integration, ApiError, IntegrationId>({
    mutationKey: mutationKeys.integrations.connect,
    mutationFn: (id) => integrationService.connectIntegration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.integrations.all });
    },
  });
}

export function useDisconnectIntegration() {
  const queryClient = useQueryClient();
  return useMutation<Integration, ApiError, IntegrationId>({
    mutationKey: mutationKeys.integrations.disconnect,
    mutationFn: (id) => integrationService.disconnectIntegration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.integrations.all });
    },
  });
}

export function useUpdateIntegrationSettings() {
  const queryClient = useQueryClient();
  return useMutation<Integration, ApiError, { id: IntegrationId; settings: any }>({
    mutationKey: mutationKeys.integrations.updateSettings,
    mutationFn: ({ id, settings }) => integrationService.updateIntegrationSettings(id, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.integrations.all });
    },
  });
}
