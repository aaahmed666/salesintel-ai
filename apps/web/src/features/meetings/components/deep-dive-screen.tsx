'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Button, Card, Skeleton } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import { useDeepDive } from '../queries/use-deep-dive';
import { formatDateTime } from '../hooks/use-format';
import { InsightCard } from './insight-card';
import { RecommendationCard } from './recommendation-card';
import { SentimentAnalysis } from './sentiment-analysis';
import { CompetitorAnalysis } from './competitor-analysis';
import { IndustryContext } from './industry-context';
import { KeywordDetection } from './keyword-detection';
import { BuyingSignals } from './buying-signals';
import { ObjectionAnalysis } from './objection-analysis';

interface DeepDiveScreenProps {
  meetingId: string;
}

const SECTIONS = [
  { id: 'sentiment', icon: 'sentiment_satisfied' },
  { id: 'competitor', icon: 'swords' },
  { id: 'industry', icon: 'insights' },
  { id: 'keyword', icon: 'tag' },
  { id: 'buyingSignals', icon: 'trending_up' },
  { id: 'objection', icon: 'report' },
] as const;

/** AI Analysis Deep Dive: six analysis sections + recommendations rail. */
export function DeepDiveScreen({ meetingId }: DeepDiveScreenProps) {
  const t = useTranslations('meetings.deepDive');
  const locale = useLocale();
  const { data, isLoading, isError, refetch } = useDeepDive(meetingId);

  if (isLoading) return <DeepDiveSkeleton />;

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <Icon name="error" size={40} className="text-error" />
        <p className="text-body-md text-on-surface-variant max-w-sm">{t('error')}</p>
        <Button variant="secondary" onClick={() => refetch()}>
          {t('retry')}
        </Button>
      </div>
    );
  }

  const topObjection = data.objections[0];

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="border-outline-variant flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <span className="bg-primary-fixed text-primary text-label-sm rounded-full px-3 py-1 font-semibold uppercase tracking-wide">
              {t('closeWon', { value: data.closeWonProbability })}
            </span>
            <span className="text-body-sm text-on-surface-variant">{formatDateTime(data.date, locale)}</span>
          </div>
          <h1 className="text-headline-md text-on-surface font-semibold">{data.title}</h1>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <Button variant="secondary" className="gap-2">
            <Icon name="ios_share" size={18} />
            {t('export')}
          </Button>
          <Button className="gap-2">
            <Icon name="add" size={18} />
            {t('createLead')}
          </Button>
        </div>
      </div>

      {/* AI Context Highlights */}
      <section className="mt-6">
        <h2 className="text-label-md text-primary mb-3 font-semibold uppercase tracking-wide">
          {t('contextHighlights')}
        </h2>
        <div className="gap-md grid grid-cols-1 sm:grid-cols-3">
          <InsightCard
            icon="warning"
            tone="risk"
            title={t('objection.count', { count: data.objections.length })}
          >
            {topObjection ? <span className="italic">&ldquo;{topObjection.quote}&rdquo;</span> : t('objection.empty')}
          </InsightCard>
          <InsightCard icon="swords" tone="positive" title={t('competitor.title')}>
            <div className="flex flex-wrap gap-1.5">
              {data.competitors.length > 0
                ? data.competitors.map((c) => (
                    <span
                      key={c.id}
                      className="bg-surface-container-lowest border-outline-variant text-label-sm rounded border px-2 py-0.5 font-medium uppercase"
                    >
                      {c.name}
                    </span>
                  ))
                : t('competitor.empty')}
            </div>
          </InsightCard>
          <InsightCard icon="auto_awesome" tone="primary" title={t('keyIntent')} iconFilled>
            {data.buyingSignals.summary}
          </InsightCard>
        </div>
      </section>

      <div className="gap-lg mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Main: section nav + analysis sections */}
        <div className="min-w-0">
          <nav className="mb-4 flex flex-wrap gap-2" aria-label={t('sectionNav')}>
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#section-${s.id}`}
                className="bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high text-label-sm inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-colors"
              >
                <Icon name={s.icon} size={16} />
                {t(`${s.id}.title`)}
              </a>
            ))}
          </nav>

          <div className="space-y-lg">
            <div id="section-sentiment">
              <SentimentAnalysis data={data.sentiment} />
            </div>
            <div id="section-competitor">
              <CompetitorAnalysis competitors={data.competitors} summary={data.competitorSummary} />
            </div>
            <div id="section-industry">
              <IndustryContext data={data.industry} />
            </div>
            <div id="section-keyword">
              <KeywordDetection keywords={data.keywords} summary={data.keywordSummary} />
            </div>
            <div id="section-buyingSignals">
              <BuyingSignals data={data.buyingSignals} />
            </div>
            <div id="section-objection">
              <ObjectionAnalysis objections={data.objections} summary={data.objectionSummary} />
            </div>
          </div>
        </div>

        {/* Rail: deal health + recommendations */}
        <aside className="space-y-lg lg:sticky lg:top-24 lg:self-start">
          <div className="from-primary to-secondary text-on-primary relative overflow-hidden rounded-xl bg-gradient-to-br p-5">
            <p className="text-label-sm font-semibold uppercase tracking-wide opacity-80">
              {t('dealHealth')}
            </p>
            <p className="text-headline-lg mt-1 font-bold tabular-nums">{data.dealHealthScore}</p>
            <Icon name="shield" size={72} filled className="pointer-events-none absolute -bottom-3 end-2 opacity-15" />
          </div>

          <Card>
            <div className="mb-3 flex items-center gap-2">
              <Icon name="auto_awesome" size={18} filled className="text-primary" />
              <h2 className="text-body-md text-on-surface font-semibold">{t('nextBestAction')}</h2>
            </div>
            <div className="space-y-3">
              {data.recommendations.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function DeepDiveSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="border-outline-variant flex items-start justify-between border-b pb-5">
        <div className="space-y-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-8 w-80" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
      <div className="gap-lg mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-lg">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
        <div className="space-y-lg">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
