import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PipelineOverviewScreen } from '@/features/pipeline';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pipeline' });
  return { title: t('boardTitle') };
}

export default async function PipelineBoardPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PipelineOverviewScreen defaultView="board" />;
}
