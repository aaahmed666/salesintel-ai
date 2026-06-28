'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Alert, Spinner } from '@salesintel/ui';
import { ROUTES } from '@salesintel/config';
import { useRouter } from '@/i18n/navigation';
import { useGoogleCallback } from '../queries';

/**
 * Mounted on the login page. When Supabase redirects back from Google, the URL
 * fragment carries #access_token=...&refresh_token=.... This component detects
 * that, forwards the tokens to the backend Google callback (which provisions
 * the user on first login), persists the session, and routes to the dashboard.
 *
 * Renders nothing unless an OAuth return is in progress.
 */
export function GoogleCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleCallback = useGoogleCallback();
  const started = useRef(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (started.current || typeof window === 'undefined') return;

    const hash = window.location.hash.replace(/^#/, '');
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (!accessToken || !refreshToken) return;

    started.current = true;
    setActive(true);

    // Clear the fragment so a refresh doesn't re-trigger.
    window.history.replaceState(null, '', window.location.pathname + window.location.search);

    const inviteToken = searchParams.get('invite') ?? undefined;

    googleCallback.mutate(
      { accessToken, refreshToken, inviteToken },
      {
        onSuccess: () => router.replace(ROUTES.dashboard.root),
      },
    );
  }, [googleCallback, router, searchParams]);

  if (!active) return null;

  if (googleCallback.isError) {
    return (
      <Alert variant="error">
        {googleCallback.error?.message ?? 'errors.unknown'}
      </Alert>
    );
  }

  return (
    <div className="flex flex-col items-center gap-md py-md text-center">
      <Spinner className="h-6 w-6" />
      <p className="text-body-md text-on-surface-variant">Signing you in…</p>
    </div>
  );
}
