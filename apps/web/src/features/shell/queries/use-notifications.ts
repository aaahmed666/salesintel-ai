'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, mutationKeys, shellService } from '@salesintel/api';
import type { ApiError, AppNotification } from '@salesintel/types';

export function useNotifications() {
  return useQuery<AppNotification[], ApiError>({
    queryKey: queryKeys.shell.notifications(),
    queryFn: () => shellService.listNotifications(),
  });
}

export function useUnreadCount(): number {
  const { data } = useNotifications();
  return data?.filter((n) => !n.read).length ?? 0;
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation<AppNotification[], ApiError, string>({
    mutationKey: mutationKeys.shell.markRead,
    mutationFn: (id) => shellService.markNotificationRead(id),
    onSuccess: (next) => qc.setQueryData(queryKeys.shell.notifications(), next),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation<AppNotification[], ApiError, void>({
    mutationKey: mutationKeys.shell.markAllRead,
    mutationFn: () => shellService.markAllNotificationsRead(),
    onSuccess: (next) => qc.setQueryData(queryKeys.shell.notifications(), next),
  });
}
