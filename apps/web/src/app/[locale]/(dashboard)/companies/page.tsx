import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CompaniesScreen } from '@/features/companies';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'companies' });
  return { title: t('pageTitle') };
}

export default async function CompaniesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CompaniesScreen />;
}
