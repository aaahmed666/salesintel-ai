import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { TranscriptHighlightsScreen } from '@/features/meetings';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meetings.transcript' });
  return { title: t('pageTitle') };
}

export default async function MeetingTranscriptPage({ params }: PageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <TranscriptHighlightsScreen meetingId={id} />;
}
