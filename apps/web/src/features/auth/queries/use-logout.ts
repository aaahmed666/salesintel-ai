'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, mutationKeys } from '@salesintel/api';
import { sessionStore } from '@/lib/session-store';

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mutationKeys.auth.logout,
    mutationFn: () => authService.logout(),
    onSettled: () => {
      sessionStore.clear();
      queryClient.clear();
    },
  });
}
