'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ShieldCheck } from 'lucide-react';
import { ROUTES } from '@salesintel/config';
import { Spinner } from '@salesintel/ui';
import { useRouter } from '@/i18n/navigation';
import { CenteredAuthShell, TwoFactorForm } from '@/features/auth/components';

/**
 * Standalone two-factor screen (design parity / deep-link). The live login flow
 * renders {@link TwoFactorForm} inline after the credentials step; this page
 * reads the challenge from the query string so it can be linked directly.
 */
function TwoFactorContent() {
  const t = useTranslations('auth.twoFactor');
  const router = useRouter();
  const params = useSearchParams();

  const challengeId = params.get('challengeId') ?? 'demo-challenge';
  const maskedEmail = params.get('email') ?? 'j****@enterprise.ai';

  return (
    <CenteredAuthShell
      title={t('title')}
      icon={
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-gradient text-on-primary shadow-sm">
          <ShieldCheck className="h-6 w-6" aria-hidden />
        </div>
      }
    >
      <TwoFactorForm
        challengeId={challengeId}
        maskedEmail={maskedEmail}
        onVerified={() => router.replace(ROUTES.dashboard.root)}
        onCancel={() => router.replace(ROUTES.auth.login)}
      />
    </CenteredAuthShell>
  );
}

export default function TwoFactorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner className="h-6 w-6" />
        </div>
      }
    >
      <TwoFactorContent />
    </Suspense>
  );
}
