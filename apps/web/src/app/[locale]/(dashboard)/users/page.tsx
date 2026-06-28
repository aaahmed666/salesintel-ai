import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { UsersScreen } from '@/features/users';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'users' });
  return { title: t('pageTitle') };
}

export default async function UsersPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <UsersScreen />;
}
