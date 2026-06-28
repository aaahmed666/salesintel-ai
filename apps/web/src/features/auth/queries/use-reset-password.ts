'use client';

import { useMutation } from '@tanstack/react-query';
import { authService, mutationKeys } from '@salesintel/api';
import type { ApiError, MessageResult, ResetPasswordInput } from '@salesintel/types';

export function useResetPassword() {
  return useMutation<MessageResult, ApiError, ResetPasswordInput>({
    mutationKey: mutationKeys.auth.resetPassword,
    mutationFn: (input) => authService.resetPassword(input),
  });
}
