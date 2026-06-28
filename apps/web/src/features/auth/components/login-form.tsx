'use client';

import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Mail } from 'lucide-react';
import { Alert, Button, Input } from '@salesintel/ui';
import { ROUTES } from '@salesintel/config';
import { Link, useRouter } from '@/i18n/navigation';
import { loginSchema, type LoginValues } from '../schemas';
import { useLogin } from '../queries';
import { useAuthErrorMessage } from '../hooks';
import { FormField } from './form-field';
import { PasswordInput } from './password-input';
import { GoogleButton } from './google-button';
import { AuthDivider } from './auth-divider';
import { TwoFactorForm } from './two-factor-form';
import { GoogleCallbackHandler } from './google-callback-handler';
import type { TwoFactorChallenge } from '../types';

export function LoginForm() {
  const t = useTranslations('auth.login');
  const tc = useTranslations('common');
  const router = useRouter();
  const login = useLogin();
  const getErrorMessage = useAuthErrorMessage();

  const [challenge, setChallenge] = useState<TwoFactorChallenge | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: (result) => {
        if (result.status === 'two_factor_required') {
          setChallenge({ challengeId: result.challengeId, maskedEmail: result.maskedEmail });
        } else {
          router.replace(ROUTES.dashboard.root);
        }
      },
    });
  });

  // Branch to the 2FA step once a challenge is issued.
  if (challenge) {
    return (
      <TwoFactorForm
        challengeId={challenge.challengeId}
        maskedEmail={challenge.maskedEmail}
        onCancel={() => setChallenge(null)}
        onVerified={() => router.replace(ROUTES.dashboard.root)}
      />
    );
  }

  const apiError = getErrorMessage(login.error);

  return (
    <form onSubmit={onSubmit} className="space-y-md" noValidate>
      {/* Completes Google sign-in if we returned from the OAuth redirect. */}
      <Suspense fallback={null}>
        <GoogleCallbackHandler />
      </Suspense>

      {apiError && <Alert variant="error">{apiError}</Alert>}

      <FormField id="email" label={t('emailLabel')} error={errors.email && t(errors.email.message!)}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t('emailPlaceholder')}
          startIcon={<Mail className="h-5 w-5" />}
          invalid={!!errors.email}
          {...register('email')}
        />
      </FormField>

      <FormField
        id="password"
        label={t('passwordLabel')}
        error={errors.password && t(errors.password.message!)}
        action={
          <Link
            href={ROUTES.auth.forgotPassword}
            className="text-body-sm font-semibold text-primary hover:underline"
          >
            {t('forgotPassword')}
          </Link>
        }
      >
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="••••••••"
          invalid={!!errors.password}
          {...register('password')}
        />
      </FormField>

      <Button type="submit" fullWidth size="lg" loading={login.isPending}>
        {login.isPending ? t('submitting') : t('submit')}
      </Button>

      <AuthDivider label={tc('or')} />

      <GoogleButton
        label={t('google')}
        redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined}
      />

      <p className="pt-2 text-center text-body-sm text-on-surface-variant">
        {t('noAccount')}{' '}
        <Link href={ROUTES.auth.register} className="font-semibold text-primary hover:underline">
          {t('startTrial')}
        </Link>
      </p>
    </form>
  );
}
