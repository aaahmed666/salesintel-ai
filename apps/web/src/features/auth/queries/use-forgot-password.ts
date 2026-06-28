'use client';

import { useMutation } from '@tanstack/react-query';
import { authService, mutationKeys } from '@salesintel/api';
import type { ApiError, ForgotPasswordInput, MessageResult } from '@salesintel/types';

export function useForgotPassword() {
  return useMutation<MessageResult, ApiError, ForgotPasswordInput>({
    mutationKey: mutationKeys.auth.forgotPassword,
    mutationFn: (input) => authService.forgotPassword(input),
  });
}
