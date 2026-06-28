'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import type { ApiError } from '@salesintel/types';

/**
 * Translate an {@link ApiError} (whose `message` is an i18n key like
 * `errors.invalidCredentials`) into a display string, with a safe fallback.
 */
export function useAuthErrorMessage() {
  const t = useTranslations();

  return useCallback(
    (error: ApiError | null | undefined): string | null => {
      if (!error) return null;
      const key = error.message;
      // next-intl throws if the key is missing; guard with has().
      try {
        return t(key as never);
      } catch {
        return t('errors.unknown');
      }
    },
    [t],
  );
}
