'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Alert, Button } from '@salesintel/ui';
import { TWO_FACTOR_CODE_LENGTH } from '@salesintel/config';
import { useResendTwoFactor, useTwoFactor } from '../queries';
import { useAuthErrorMessage, useResendCooldown } from '../hooks';
import { OtpInput } from './otp-input';

interface TwoFactorFormProps {
  challengeId: string;
  maskedEmail: string;
  onVerified: () => void;
  onCancel: () => void;
}

export function TwoFactorForm({
  challengeId,
  maskedEmail,
  onVerified,
  onCancel,
}: TwoFactorFormProps) {
  const t = useTranslations('auth.twoFactor');
  const verify = useTwoFactor();
  const resend = useResendTwoFactor();
  const getErrorMessage = useAuthErrorMessage();
  const cooldown = useResendCooldown();

  const [code, setCode] = useState('');
  const [resent, setResent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== TWO_FACTOR_CODE_LENGTH) return;
    verify.mutate({ challengeId, code }, { onSuccess: onVerified });
  }

  function handleResend() {
    setResent(false);
    resend.mutate(challengeId, {
      onSuccess: () => {
        setResent(true);
        cooldown.start();
      },
    });
  }

  const apiError = getErrorMessage(verify.error);

  return (
    <form onSubmit={submit} className="space-y-lg" noValidate>
      <div className="space-y-1 text-center">
        <p className="text-body-md text-on-surface-variant">{t('subtitle')}</p>
        <p className="font-display text-body-lg font-semibold text-on-surface" dir="ltr">
          {maskedEmail}
        </p>
      </div>

      {apiError && <Alert variant="error">{apiError}</Alert>}
      {resent && !apiError && <Alert variant="success">{t('resent')}</Alert>}

      <OtpInput value={code} onChange={setCode} invalid={!!apiError} disabled={verify.isPending} />

      <Button
        type="submit"
        variant="gradient"
        fullWidth
        size="lg"
        loading={verify.isPending}
        disabled={code.length !== TWO_FACTOR_CODE_LENGTH}
      >
        {verify.isPending ? t('submitting') : t('submit')}
        {!verify.isPending && <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />}
      </Button>

      <div className="space-y-1 text-center text-body-sm">
        <p className="text-on-surface-variant">{t('noCode')}</p>
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown.isCoolingDown || resend.isPending}
          className="font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:text-on-surface-variant disabled:no-underline"
        >
          {cooldown.isCoolingDown ? t('resendIn', { seconds: cooldown.remaining }) : t('resend')}
        </button>
      </div>

      <div className="flex items-center justify-center gap-md pt-2 text-body-sm text-on-surface-variant">
        <button type="button" className="hover:text-on-surface">
          {t('support')}
        </button>
        <span className="text-outline-variant">•</span>
        <button type="button" onClick={onCancel} className="hover:text-on-surface">
          {t('cancel')}
        </button>
      </div>
    </form>
  );
}
