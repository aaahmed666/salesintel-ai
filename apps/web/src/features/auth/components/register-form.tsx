'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Building2, Mail, User } from 'lucide-react';
import { Alert, Button, Input } from '@salesintel/ui';
import { ROUTES } from '@salesintel/config';
import { useRouter } from '@/i18n/navigation';
import { registerSchema, type RegisterValues } from '../schemas';
import { useRegister, useInvitePreview } from '../queries';
import { useAuthErrorMessage } from '../hooks';
import { FormField } from './form-field';
import { PasswordInput } from './password-input';
import { GoogleButton } from './google-button';
import { AuthDivider } from './auth-divider';

export function RegisterForm() {
  const t = useTranslations('auth.register');
  const tc = useTranslations('common');
  const router = useRouter();
  const registerMutation = useRegister();
  const getErrorMessage = useAuthErrorMessage();

  // Invite flow: /register?invite=<token>
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('invite');
  const invitePreview = useInvitePreview(inviteToken);
  const isInvite = Boolean(inviteToken);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      organizationName: '',
      inviteToken: inviteToken ?? undefined,
    },
  });

  // Prefill email (locked) + inviteToken once the invite resolves.
  useEffect(() => {
    if (inviteToken) setValue('inviteToken', inviteToken);
    if (invitePreview.data?.email) setValue('email', invitePreview.data.email);
  }, [inviteToken, invitePreview.data, setValue]);

  const onSubmit = handleSubmit((values) => {
    registerMutation.mutate(
      {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        // Exactly one of these drives the backend flow.
        inviteToken: values.inviteToken || undefined,
        organizationName: values.inviteToken ? undefined : values.organizationName,
      },
      {
        onSuccess: () => router.replace(ROUTES.auth.login),
        onError: (error) => {
          if (error.fieldErrors?.email) {
            setError('email', { message: error.fieldErrors.email });
          }
        },
      },
    );
  });

  const apiError = getErrorMessage(registerMutation.error);
  const showApiErrorBanner = apiError && !registerMutation.error?.fieldErrors?.email;

  return (
    <form onSubmit={onSubmit} className="space-y-md" noValidate>
      {showApiErrorBanner && <Alert variant="error">{apiError}</Alert>}
      {isInvite && invitePreview.data && (
        <Alert variant="info">
          {t('invitedAs', { role: invitePreview.data.role })}
        </Alert>
      )}

      <input type="hidden" {...register('inviteToken')} />

      <FormField
        id="fullName"
        label={t('fullNameLabel')}
        uppercaseLabel
        error={errors.fullName && t(errors.fullName.message!)}
      >
        <Input
          id="fullName"
          autoComplete="name"
          placeholder={t('fullNamePlaceholder')}
          startIcon={<User className="h-5 w-5" />}
          invalid={!!errors.fullName}
          {...register('fullName')}
        />
      </FormField>

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
          readOnly={isInvite}
          {...register('email')}
        />
      </FormField>

      {/* Self-signup only: name the organization being created. */}
      {!isInvite && (
        <FormField
          id="organizationName"
          label={t('organizationLabel')}
          uppercaseLabel
          error={errors.organizationName && t(errors.organizationName.message!)}
        >
          <Input
            id="organizationName"
            autoComplete="organization"
            placeholder={t('organizationPlaceholder')}
            startIcon={<Building2 className="h-5 w-5" />}
            invalid={!!errors.organizationName}
            {...register('organizationName')}
          />
        </FormField>
      )}

      <FormField
        id="password"
        label={t('passwordLabel')}
        uppercaseLabel
        error={errors.password && t(errors.password.message!)}
        hint={t('passwordHint')}
      >
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="••••••••"
          invalid={!!errors.password}
          {...register('password')}
        />
      </FormField>

      <Button type="submit" variant="gradient" fullWidth size="lg" loading={registerMutation.isPending}>
        {registerMutation.isPending ? t('submitting') : t('submit')}
        {!registerMutation.isPending && <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />}
      </Button>

      <AuthDivider label={tc('orContinueWith')} />

      <GoogleButton
        label={t('google')}
        redirectTo={
          typeof window !== 'undefined'
            ? `${window.location.origin}/login${inviteToken ? `?invite=${inviteToken}` : ''}`
            : undefined
        }
      />

      <p className="pt-2 text-center text-body-sm leading-relaxed text-on-surface-variant">
        {t('agree')}{' '}
        <a href="#" className="font-medium text-primary hover:underline">{t('terms')}</a>{' '}
        {t('and')}{' '}
        <a href="#" className="font-medium text-primary hover:underline">{t('privacy')}</a>.
      </p>
    </form>
  );
}
