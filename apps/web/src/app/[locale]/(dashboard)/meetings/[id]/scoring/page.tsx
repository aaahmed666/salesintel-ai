import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ScoringScreen } from '@/features/scoring';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meetings.scoring' });
  return { title: t('pageTitle') };
}

export default async function ScoringPage({ params }: PageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <ScoringScreen meetingId={id} />;
}
