'use client';

import { useSyncExternalStore } from 'react';
import { sessionStore } from '@/lib/session-store';
import type { AuthSession } from '@salesintel/types';

/**
 * Subscribe to the persisted session without React Query, since the session is
 * client-only state. Components re-render when sign-in/out occurs.
 */
export function useSession(): AuthSession | null {
  return useSyncExternalStore(
    sessionStore.subscribe,
    () => sessionStore.get(),
    () => null,
  );
}

export function useIsAuthenticated(): boolean {
  return useSession() !== null;
}
