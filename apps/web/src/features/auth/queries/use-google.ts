'use client';

import { useMutation } from '@tanstack/react-query';
import { authService, mutationKeys } from '@salesintel/api';
import type {
  ApiError,
  AuthSession,
  GoogleCallbackInput,
  GoogleStartInput,
  GoogleStartResult,
} from '@salesintel/types';
import { sessionStore } from '@/lib/session-store';

/**
 * Step 1 — ask the backend for the Google authorization URL, then redirect the
 * browser to it. Supabase handles the OAuth handshake and redirects back with
 * tokens in the URL fragment.
 */
export function useGoogleStart() {
  return useMutation<GoogleStartResult, ApiError, GoogleStartInput>({
    mutationKey: mutationKeys.auth.googleStart,
    mutationFn: (input) => authService.googleStart(input),
    onSuccess: (result) => {
      if (typeof window !== 'undefined' && result.url) {
        window.location.href = result.url;
      }
    },
  });
}

/**
 * Step 2 — after returning from Google, hand the tokens to the backend so it
 * can provision the public.Users row (first login) and return a full session.
 */
export function useGoogleCallback() {
  return useMutation<AuthSession, ApiError, GoogleCallbackInput>({
    mutationKey: mutationKeys.auth.googleCallback,
    mutationFn: (input) => authService.googleCallback(input),
    onSuccess: (session) => sessionStore.set(session),
  });
}
