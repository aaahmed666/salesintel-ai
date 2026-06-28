import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { DeveloperScreen } from '@/features/developer';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'developer' });
  return { title: t('pageTitle') };
}

export default async function DeveloperPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DeveloperScreen />;
}
