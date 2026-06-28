import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { DeepDiveScreen } from '@/features/meetings';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meetings.deepDive' });
  return { title: t('pageTitle') };
}

export default async function MeetingAnalysisPage({ params }: PageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <DeepDiveScreen meetingId={id} />;
}
