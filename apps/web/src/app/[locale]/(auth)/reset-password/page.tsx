import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { KeyRound } from 'lucide-react';
import { CenteredAuthShell } from '@/features/auth/components';
import { ResetPasswordClient } from '@/features/auth/components/reset-password-client';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string; access_token?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.resetPassword');
  return { title: t('submit') };
}

export default async function ResetPasswordPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { token, access_token: accessToken } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('auth.resetPassword');

  return (
    <CenteredAuthShell
      title={t('title')}
      subtitle={t('subtitle')}
      icon={
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-gradient text-on-primary shadow-sm">
          <KeyRound className="h-6 w-6" aria-hidden />
        </div>
      }
    >
      <ResetPasswordClient fallbackToken={accessToken ?? token} />
    </CenteredAuthShell>
  );
}
