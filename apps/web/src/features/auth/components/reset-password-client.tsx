'use client';

import { useEffect, useState } from 'react';
import { ResetPasswordForm } from './reset-password-form';

/**
 * Supabase recovery links land with the token in the URL *fragment*
 * (e.g. #access_token=...&type=recovery), which is only visible client-side.
 * This wrapper extracts it and feeds it to the form. Falls back to the
 * `?token=`/`?access_token=` query param if a custom backend redirect is used.
 */
export function ResetPasswordClient({ fallbackToken }: { fallbackToken?: string }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let token: string | null = fallbackToken ?? null;

    if (typeof window !== 'undefined') {
      // Fragment: #access_token=...&...
      const hash = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(hash);
      token = hashParams.get('access_token') ?? token;

      // Query fallback: ?access_token=... or ?token=...
      if (!token) {
        const qs = new URLSearchParams(window.location.search);
        token = qs.get('access_token') ?? qs.get('token') ?? null;
      }
    }

    setAccessToken(token);
    setReady(true);
  }, [fallbackToken]);

  if (!ready) return null;

  return <ResetPasswordForm accessToken={accessToken ?? ''} />;
}
