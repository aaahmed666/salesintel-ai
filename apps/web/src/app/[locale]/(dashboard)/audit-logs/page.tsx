import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AuditLogsScreen } from '@/features/audit-logs';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auditLogs' });
  return { title: t('pageTitle') };
}

export default async function AuditLogsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AuditLogsScreen />;
}
