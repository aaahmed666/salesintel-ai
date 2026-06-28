'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { developerService, queryKeys, mutationKeys } from '@salesintel/api';
import type { ApiError, ApiKey, Webhook, WebhookLog } from '@salesintel/types';

export function useApiKeys() {
  return useQuery<ApiKey[], ApiError>({
    queryKey: queryKeys.developer.keys(),
    queryFn: () => developerService.getApiKeys(),
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  return useMutation<ApiKey, ApiError, string>({
    mutationKey: mutationKeys.developer.createKey,
    mutationFn: (name) => developerService.createApiKey(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.developer.keys() });
    },
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();
  return useMutation<ApiKey, ApiError, string>({
    mutationKey: mutationKeys.developer.revokeKey,
    mutationFn: (id) => developerService.revokeApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.developer.keys() });
    },
  });
}

export function useWebhooks() {
  return useQuery<Webhook[], ApiError>({
    queryKey: queryKeys.developer.webhooks(),
    queryFn: () => developerService.getWebhooks(),
  });
}

export function useCreateWebhook() {
  const queryClient = useQueryClient();
  return useMutation<Webhook, ApiError, { url: string; description: string; events: string[] }>({
    mutationKey: mutationKeys.developer.createWebhook,
    mutationFn: ({ url, description, events }) => developerService.createWebhook(url, description, events),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.developer.webhooks() });
    },
  });
}

export function useEditWebhook() {
  const queryClient = useQueryClient();
  return useMutation<Webhook, ApiError, { id: string; url: string; description: string; events: string[]; status: 'active' | 'inactive' }>({
    mutationKey: mutationKeys.developer.editWebhook,
    mutationFn: ({ id, url, description, events, status }) => developerService.editWebhook(id, url, description, events, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.developer.webhooks() });
    },
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();
  return useMutation<boolean, ApiError, string>({
    mutationKey: mutationKeys.developer.deleteWebhook,
    mutationFn: (id) => developerService.deleteWebhook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.developer.webhooks() });
    },
  });
}

export function useWebhookLogs() {
  return useQuery<WebhookLog[], ApiError>({
    queryKey: queryKeys.developer.logs(),
    queryFn: () => developerService.getWebhookLogs(),
  });
}

export function useRetryWebhook() {
  const queryClient = useQueryClient();
  return useMutation<WebhookLog, ApiError, string>({
    mutationKey: mutationKeys.developer.retryWebhook,
    mutationFn: (logId) => developerService.retryWebhookDelivery(logId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.developer.logs() });
    },
  });
}
