'use client';

import { useMutation } from '@tanstack/react-query';
import { authService, mutationKeys } from '@salesintel/api';
import type { ApiError, MessageResult, VerifyEmailInput } from '@salesintel/types';

export function useVerifyEmail() {
  return useMutation<MessageResult, ApiError, VerifyEmailInput>({
    mutationKey: mutationKeys.auth.verifyEmail,
    mutationFn: (input) => authService.verifyEmail(input),
  });
}
