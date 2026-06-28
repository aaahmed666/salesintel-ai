import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  CenteredAuthShell,
  LoginForm,
  SecurityBadges,
} from '@/features/auth/components';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.login');
  return { title: t('submit') };
}

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('auth');

  return (
    <CenteredAuthShell
      title={t('login.title')}
      subtitle={t('login.subtitle')}
      footer={<SecurityBadges soc2={t('badges.soc2')} encryption={t('badges.encryption')} />}
    >
      <LoginForm />
    </CenteredAuthShell>
  );
}
