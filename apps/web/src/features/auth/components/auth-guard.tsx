'use client';

import { useEffect } from 'react';
import { Spinner } from '@salesintel/ui';
import { ROUTES } from '@salesintel/config';
import { useRouter } from '@/i18n/navigation';
import { useIsAuthenticated } from '@/features/auth';

/**
 * Gate for authenticated routes. If there's no client session, redirect to
 * login. Renders a lightweight loader during the redirect to avoid flashing
 * protected content.
 *
 * NOTE: this is a client-side guard for UX. For hard security, also enforce
 * auth on every backend endpoint (already done via get_current_user) and,
 * ideally, add a server middleware check when sessions move to httpOnly cookies.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(ROUTES.auth.login);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return <>{children}</>;
}
