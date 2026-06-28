import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { IntegrationsScreen } from '@/features/integrations';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'integrations' });
  return { title: t('pageTitle') };
}

export default async function IntegrationsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <IntegrationsScreen />;
}
