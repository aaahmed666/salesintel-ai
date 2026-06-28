import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MailCheck } from 'lucide-react';
import { CenteredAuthShell, EmailVerification } from '@/features/auth/components';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token_hash?: string; type?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.verifyEmail');
  return { title: t('submit') };
}

export default async function VerifyEmailPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { token_hash: tokenHash, type } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('auth.verifyEmail');

  return (
    <CenteredAuthShell
      title={t('title')}
      icon={
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-gradient text-on-primary shadow-sm">
          <MailCheck className="h-6 w-6" aria-hidden />
        </div>
      }
    >
      <EmailVerification tokenHash={tokenHash} type={type} />
    </CenteredAuthShell>
  );
}
