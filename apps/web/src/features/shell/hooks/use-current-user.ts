'use client';

import type { User } from '@salesintel/types';
import { useSession } from '@/features/auth';

/**
 * The signed-in user, or a demo fallback so the shell still renders in mock
 * mode before a real session exists. In real (non-mock) mode the AuthGuard
 * ensures a session is present before any dashboard screen mounts, so the
 * fallback is effectively never used there.
 */
export function useCurrentUser(): User {
  const session = useSession();
  return session?.user ?? DEMO_USER;
}

/** Nullable accessor for places that must distinguish "no session". */
export function useCurrentUserOrNull(): User | null {
  return useSession()?.user ?? null;
}

/** Demo identity used when no session is present (mock-first development).
 *  Set to `admin` so every screen is reachable for review in mock mode; the
 *  RoleGuard still enforces real restrictions for authenticated lower roles. */
export const DEMO_USER: User = {
  id: 'usr_demo',
  fullName: 'Sam Rivera',
  email: 'sam.rivera@enterprise.ai',
  role: 'admin',
  status: 'active',
  emailVerified: true,
  twoFactorEnabled: false,
  createdAt: '2024-03-04T09:00:00.000Z',
};
