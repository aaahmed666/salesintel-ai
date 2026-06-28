'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { MailCheck } from 'lucide-react';
import { Alert, Button, Spinner } from '@salesintel/ui';
import { ROUTES } from '@salesintel/config';
import { Link } from '@/i18n/navigation';
import { useVerifyEmail } from '../queries';
import { useAuthErrorMessage } from '../hooks';

/**
 * Supabase confirmation links carry `token_hash` + `type` (in the query string
 * or fragment). When present we auto-verify on mount; otherwise we show the
 * "check your inbox" prompt.
 */
export function EmailVerification({
  tokenHash: tokenHashProp,
  type: typeProp,
}: {
  tokenHash?: string;
  type?: string;
}) {
  const t = useTranslations('auth.verifyEmail');
  const verify = useVerifyEmail();
  const getErrorMessage = useAuthErrorMessage();
  const attempted = useRef(false);

  const [resolved, setResolved] = useState<{ tokenHash?: string; type?: string }>({
    tokenHash: tokenHashProp,
    type: typeProp,
  });

  // Pick up token_hash from the URL fragment if not provided via props/query.
  useEffect(() => {
    if (resolved.tokenHash || typeof window === 'undefined') return;
    const hash = window.location.hash.replace(/^#/, '');
    const params = new URLSearchParams(hash);
    const th = params.get('token_hash') ?? undefined;
    const ty = params.get('type') ?? undefined;
    if (th) setResolved({ tokenHash: th, type: ty });
  }, [resolved.tokenHash]);

  useEffect(() => {
    if (resolved.tokenHash && !attempted.current) {
      attempted.current = true;
      verify.mutate({ tokenHash: resolved.tokenHash, type: resolved.type });
    }
  }, [resolved, verify]);

  if (resolved.tokenHash && (verify.isPending || verify.isIdle)) {
    return (
      <div className="flex flex-col items-center gap-md py-md text-center">
        <Spinner className="h-6 w-6" />
        <p className="text-body-md text-on-surface-variant">{t('verifying')}</p>
      </div>
    );
  }

  if (verify.isSuccess) {
    return (
      <div className="space-y-md text-center">
        <Alert variant="success">{t('success')}</Alert>
        <Button asChild fullWidth size="lg">
          <Link href={ROUTES.auth.login}>{t('backToLogin')}</Link>
        </Button>
      </div>
    );
  }

  const apiError = getErrorMessage(verify.error);

  return (
    <div className="space-y-md text-center">
      {apiError && <Alert variant="error">{apiError}</Alert>}
      <div className="flex flex-col items-center gap-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container">
          <MailCheck className="h-7 w-7 text-primary" aria-hidden />
        </div>
        <p className="text-body-md text-on-surface-variant">{t('subtitle')}</p>
      </div>
      <p>
        <Link
          href={ROUTES.auth.login}
          className="text-body-sm font-medium text-on-surface-variant hover:text-on-surface"
        >
          {t('backToLogin')}
        </Link>
      </p>
    </div>
  );
}
