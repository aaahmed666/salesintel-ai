'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Skeleton, cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import { useSalesScore } from '../queries/use-sales-score';
import { OverallScoreRing } from './overall-score-ring';
import { MetricScoreCard } from './metric-score-card';
import { MetricBreakdownCard } from './metric-breakdown-card';
import { TalkRatioChart } from './talk-ratio-chart';
import { ScoreTrendSparkline } from './score-trend-sparkline';
import { CoachingCard } from './coaching-card';

type Tab = 'overview' | 'breakdown' | 'coaching';

const TABS: { id: Tab; icon: string }[] = [
  { id: 'overview', icon: 'dashboard' },
  { id: 'breakdown', icon: 'analytics' },
  { id: 'coaching', icon: 'school' },
];

interface ScoringScreenProps {
  meetingId: string;
}

/**
 * Sales Scoring Engine main screen.
 * Three tab-based views: Score Overview, Score Breakdown, Coaching Recommendations.
 */
export function ScoringScreen({ meetingId }: ScoringScreenProps) {
  const t = useTranslations('meetings.scoring');
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { data, isLoading, isError, refetch } = useSalesScore(meetingId);

  if (isLoading) return <ScoringScreenSkeleton />;

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

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="border-outline-variant mb-6 flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-label-sm text-primary mb-1 font-semibold uppercase tracking-wide">
            {t('pageTitle')}
          </p>
          <h1 className="text-headline-md text-on-surface font-semibold">{data.meetingTitle}</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">
            {data.repName} · {new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date(data.date))}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <nav className="mb-6 flex flex-wrap gap-1 rounded-xl bg-surface-container-low p-1" aria-label={t('pageTitle')}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2.5 text-label-md font-medium transition-all duration-200',
              activeTab === tab.id
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container',
            )}
          >
            <Icon name={tab.icon} size={18} filled={activeTab === tab.id} />
            {t(`tabs.${tab.id}` as never)}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="animate-[fadeIn_0.3s_ease-out]">
        {activeTab === 'overview' && <OverviewTab data={data} />}
        {activeTab === 'breakdown' && <BreakdownTab data={data} />}
        {activeTab === 'coaching' && <CoachingTab data={data} />}
      </div>
    </div>
  );
}

/* ─── Tab Views ─── */

function OverviewTab({ data }: { data: NonNullable<ReturnType<typeof useSalesScore>['data']> }) {
  const t = useTranslations('meetings.scoring');

  return (
    <div className="space-y-lg">
      {/* Hero: Overall Score + Summary */}
      <div className="gap-lg grid grid-cols-1 lg:grid-cols-[1fr_300px]">
        {/* Main area */}
        <div className="space-y-lg">
          {/* Overall score card */}
          <div className="from-primary to-secondary relative overflow-hidden rounded-2xl bg-gradient-to-br p-8 text-white">
            <div className="relative z-10 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
              <OverallScoreRing
                score={data.overallScore}
                grade={data.overallGrade}
                previousScore={data.previousScore}
              />
              <div className="flex-1 text-center sm:text-start">
                <h2 className="text-headline-md font-bold opacity-90">{t('metricSummary')}</h2>
                <p className="text-body-sm mt-2 opacity-80">
                  {t('gradeLabel', { '': data.overallGrade } as never)}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {data.metrics.map((m) => (
                    <div
                      key={m.key}
                      className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm"
                    >
                      <p className="text-[10px] font-semibold uppercase opacity-70">{m.label}</p>
                      <p className="text-headline-md font-bold tabular-nums">{m.score}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Decorative */}
            <Icon
              name="verified"
              size={120}
              filled
              className="pointer-events-none absolute -bottom-4 end-4 opacity-10"
            />
            <div className="absolute -end-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          </div>

          {/* Metric score cards grid */}
          <div>
            <h2 className="text-label-md text-primary mb-3 font-semibold uppercase tracking-wide">
              {t('metricSummary')}
            </h2>
            <div className="gap-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {data.metrics.map((metric) => (
                <MetricScoreCard key={metric.key} metric={metric} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-lg">
          <TalkRatioChart breakdown={data.talkRatioBreakdown} />
          <ScoreTrendSparkline trend={data.scoreTrend} />
        </aside>
      </div>
    </div>
  );
}

function BreakdownTab({ data }: { data: NonNullable<ReturnType<typeof useSalesScore>['data']> }) {
  const t = useTranslations('meetings.scoring');

  return (
    <div className="space-y-lg">
      <div className="flex items-center gap-2">
        <Icon name="analytics" size={20} filled className="text-primary" />
        <h2 className="text-body-md text-on-surface font-semibold">{t('metricDetail')}</h2>
      </div>
      {data.metrics.map((metric) => (
        <MetricBreakdownCard key={metric.key} metric={metric} />
      ))}
    </div>
  );
}

function CoachingTab({ data }: { data: NonNullable<ReturnType<typeof useSalesScore>['data']> }) {
  const t = useTranslations('meetings.scoring');

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sorted = [...data.coachingRecommendations].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
  );

  return (
    <div className="space-y-lg">
      {/* Coaching header */}
      <div className="from-primary-container/30 to-surface-container-low rounded-2xl bg-gradient-to-r p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <Icon name="auto_awesome" size={22} filled className="text-primary" />
          </div>
          <div>
            <h2 className="text-body-md text-on-surface font-semibold">
              {t('coaching.title')}
            </h2>
            <p className="text-body-sm text-on-surface-variant">{t('coaching.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="gap-md grid grid-cols-1 lg:grid-cols-2">
        {sorted.map((rec) => (
          <CoachingCard key={rec.id} recommendation={rec} />
        ))}
      </div>
    </div>
  );
}

/* ─── Skeleton ─── */

function ScoringScreenSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="border-outline-variant mb-6 border-b pb-5">
        <Skeleton className="mb-2 h-4 w-24" />
        <Skeleton className="h-8 w-80" />
        <Skeleton className="mt-2 h-4 w-48" />
      </div>
      <div className="mb-6 flex gap-2">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-10 w-36 rounded-lg" />
        ))}
      </div>
      <div className="gap-lg grid grid-cols-1 lg:grid-cols-[1fr_300px]">
        <div className="space-y-lg">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <div className="gap-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-52 w-full rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="space-y-lg">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
