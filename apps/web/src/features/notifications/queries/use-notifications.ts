'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shellService, queryKeys, mutationKeys } from '@salesintel/api';
import type { ApiError, AppNotification } from '@salesintel/types';

export function useNotifications() {
  return useQuery<AppNotification[], ApiError>({
    queryKey: queryKeys.shell.notifications(),
    queryFn: () => shellService.listNotifications(),
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation<AppNotification[], ApiError, string>({
    mutationKey: mutationKeys.shell.markRead,
    mutationFn: (id) => shellService.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shell.notifications() });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation<AppNotification[], ApiError, void>({
    mutationKey: mutationKeys.shell.markAllRead,
    mutationFn: () => shellService.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shell.notifications() });
    },
  });
}
