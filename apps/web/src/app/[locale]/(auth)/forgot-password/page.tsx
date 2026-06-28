import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { History } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@salesintel/config';
import { CenteredAuthShell, ForgotPasswordForm } from '@/features/auth/components';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.forgotPassword');
  return { title: t('submit') };
}

export default async function ForgotPasswordPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('auth.forgotPassword');

  return (
    <CenteredAuthShell
      title={t('title')}
      subtitle={t('subtitle')}
      icon={
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-gradient text-on-primary shadow-sm">
          <History className="h-6 w-6" aria-hidden />
        </div>
      }
      footer={
        <div className="space-y-md">
          <Link
            href={ROUTES.auth.login}
            className="inline-flex items-center gap-2 text-body-sm font-medium text-on-surface hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
            {t('backToLogin')}
          </Link>
          <div className="flex items-center justify-center gap-md border-t border-outline-variant/40 pt-md text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">
            <a href="#" className="hover:text-on-surface">{t('privacy')}</a>
            <span className="text-outline-variant">•</span>
            <a href="#" className="hover:text-on-surface">{t('terms')}</a>
          </div>
        </div>
      }
    >
      <ForgotPasswordForm />
    </CenteredAuthShell>
  );
}
