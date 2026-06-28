'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Alert, Button } from '@salesintel/ui';
import { ROUTES } from '@salesintel/config';
import { Link, useRouter } from '@/i18n/navigation';
import { resetPasswordSchema, type ResetPasswordValues } from '../schemas';
import { useResetPassword } from '../queries';
import { useAuthErrorMessage } from '../hooks';
import { FormField } from './form-field';
import { PasswordInput } from './password-input';

/**
 * `accessToken` is the Supabase recovery token. Supabase delivers it in the URL
 * fragment (#access_token=...) of the recovery link; the page component parses
 * it and passes it down here.
 */
export function ResetPasswordForm({ accessToken }: { accessToken: string }) {
  const t = useTranslations('auth.resetPassword');
  const router = useRouter();
  const reset = useResetPassword();
  const getErrorMessage = useAuthErrorMessage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { accessToken, password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit((values) => reset.mutate(values));

  if (reset.isSuccess) {
    return (
      <div className="space-y-md">
        <Alert variant="success">{t('success')}</Alert>
        <Button fullWidth size="lg" onClick={() => router.replace(ROUTES.auth.login)}>
          {t('backToLogin')}
        </Button>
      </div>
    );
  }

  const apiError = getErrorMessage(reset.error);

  return (
    <form onSubmit={onSubmit} className="space-y-md" noValidate>
      {apiError && <Alert variant="error">{apiError}</Alert>}

      <input type="hidden" {...register('accessToken')} />

      <FormField
        id="password"
        label={t('passwordLabel')}
        uppercaseLabel
        error={errors.password && t(errors.password.message!)}
      >
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder={t('passwordPlaceholder')}
          invalid={!!errors.password}
          {...register('password')}
        />
      </FormField>

      <FormField
        id="confirmPassword"
        label={t('confirmLabel')}
        uppercaseLabel
        error={errors.confirmPassword && t(errors.confirmPassword.message!)}
      >
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          placeholder={t('confirmPlaceholder')}
          invalid={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
      </FormField>

      <Button type="submit" variant="gradient" fullWidth size="lg" loading={reset.isPending}>
        {reset.isPending ? t('submitting') : t('submit')}
      </Button>

      <p className="text-center">
        <Link
          href={ROUTES.auth.login}
          className="text-body-sm font-medium text-on-surface-variant hover:text-on-surface"
        >
          {t('backToLogin')}
        </Link>
      </p>
    </form>
  );
}
