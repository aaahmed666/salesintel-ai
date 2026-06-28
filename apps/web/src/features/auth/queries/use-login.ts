'use client';

import { useMutation } from '@tanstack/react-query';
import { authService, mutationKeys } from '@salesintel/api';
import type { ApiError, AuthSession, LoginInput, LoginResult } from '@salesintel/types';
import { sessionStore } from '@/lib/session-store';

/**
 * Credentials step. On success the result is either an authenticated session
 * (persisted immediately) or a 2FA challenge the caller routes to.
 */
export function useLogin() {
  return useMutation<LoginResult, ApiError, LoginInput>({
    mutationKey: mutationKeys.auth.login,
    mutationFn: (input) => authService.login(input),
    onSuccess: (result) => {
      if (result.status === 'authenticated') {
        sessionStore.set(result.session);
      }
    },
  });
}

interface TwoFactorVars {
  challengeId: string;
  code: string;
}

export function useTwoFactor() {
  return useMutation<AuthSession, ApiError, TwoFactorVars>({
    mutationKey: mutationKeys.auth.twoFactor,
    mutationFn: (vars) => authService.verifyTwoFactor(vars),
    onSuccess: (session) => sessionStore.set(session),
  });
}

export function useResendTwoFactor() {
  return useMutation({
    mutationKey: mutationKeys.auth.resend2fa,
    mutationFn: (challengeId: string) => authService.resendTwoFactor(challengeId),
  });
}
