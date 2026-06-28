'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { authService, mutationKeys } from '@salesintel/api';
import type { ApiError, CreateInviteInput, InvitePreview } from '@salesintel/types';

/**
 * Look up an invite by token to prefill the register form (email + role).
 * Used on /register?invite=<token>.
 */
export function useInvitePreview(token: string | null) {
  return useQuery<InvitePreview>({
    queryKey: ['auth', 'invite', token],
    queryFn: () => authService.getInvite(token as string),
    enabled: Boolean(token),
    retry: false,
  });
}

/**
 * Manager/admin action: invite a user to the current organization. Returns the
 * invite link (also emailed by the backend).
 */
export function useCreateInvite() {
  return useMutation<{ inviteLink: string }, ApiError, CreateInviteInput>({
    mutationKey: mutationKeys.auth.createInvite,
    mutationFn: (input) => authService.createInvite(input),
  });
}
