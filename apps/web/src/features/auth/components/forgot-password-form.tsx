'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { ArrowRight, Mail } from 'lucide-react';
import { Alert, Button, Input } from '@salesintel/ui';
import { forgotPasswordSchema, type ForgotPasswordValues } from '../schemas';
import { useForgotPassword } from '../queries';
import { useAuthErrorMessage } from '../hooks';
import { FormField } from './form-field';

export function ForgotPasswordForm() {
  const t = useTranslations('auth.forgotPassword');
  const forgot = useForgotPassword();
  const getErrorMessage = useAuthErrorMessage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit((values) =>
    forgot.mutate({
      email: values.email,
      // Supabase appends the recovery token to this URL's fragment.
      redirectTo:
        typeof window !== 'undefined'
          ? `${window.location.origin}/reset-password`
          : undefined,
    }),
  );

  const apiError = getErrorMessage(forgot.error);

  if (forgot.isSuccess) {
    return <Alert variant="success">{t('success')}</Alert>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-md" noValidate>
      {apiError && <Alert variant="error">{apiError}</Alert>}

      <FormField
        id="email"
        label={t('emailLabel')}
        uppercaseLabel
        error={errors.email && t(errors.email.message!)}
      >
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

      <Button type="submit" variant="gradient" fullWidth size="lg" loading={forgot.isPending}>
        {forgot.isPending ? t('submitting') : t('submit')}
        {!forgot.isPending && <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />}
      </Button>
    </form>
  );
}
