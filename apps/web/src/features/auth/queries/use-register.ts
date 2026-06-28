'use client';

import { useMutation } from '@tanstack/react-query';
import { authService, mutationKeys } from '@salesintel/api';
import type { ApiError, AuthSession, RegisterInput } from '@salesintel/types';

/**
 * Register. The backend confirms email automatically and returns the created
 * user WITHOUT tokens, so we do NOT persist a session here — the UI routes the
 * user to login (or verify-email) afterward.
 */
export function useRegister() {
  return useMutation<AuthSession, ApiError, RegisterInput>({
    mutationKey: mutationKeys.auth.register,
    mutationFn: (input) => authService.register(input),
  });
}
