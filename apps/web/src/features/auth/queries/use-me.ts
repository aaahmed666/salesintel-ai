'use client';

import { useQuery } from '@tanstack/react-query';
import { authService, queryKeys } from '@salesintel/api';
import type { User } from '@salesintel/types';
import { useIsAuthenticated } from './use-session';

/**
 * Fetches the authoritative current-user profile from the backend `/auth/me`.
 * Only runs when a session exists. The shell can prefer this over the cached
 * session user for fresh role/profile data.
 */
export function useMe() {
  const isAuthenticated = useIsAuthenticated();
  return useQuery<User>({
    queryKey: queryKeys.auth.me(),
    queryFn: () => authService.me(),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}
