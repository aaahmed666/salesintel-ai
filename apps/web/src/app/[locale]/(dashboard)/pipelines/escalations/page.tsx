import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { RiskDashboardScreen } from '@/features/risks';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'risks' });
  return { title: t('pageTitle') };
}

export default async function EscalationsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RiskDashboardScreen />;
}
