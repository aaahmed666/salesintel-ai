'use client';

import { useTranslations } from 'next-intl';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import { GradeBadge } from './grade-badge';
import { ProgressIndicator } from './progress-indicator';
import type { ScoringMetric } from '@salesintel/types';

const METRIC_ICONS: Record<string, string> = {
  talkRatio: 'record_voice_over',
  discovery: 'explore',
  objectionHandling: 'shield',
  commitment: 'handshake',
  nextSteps: 'checklist',
};

const GRADE_COLOR: Record<string, string> = {
  'A+': '#10b981',
  A: '#4648d4',
  B: '#00628d',
  C: '#f59e0b',
  D: '#ba1a1a',
};

interface MetricScoreCardProps {
  metric: ScoringMetric;
  className?: string;
}

/** Compact score card for each of the 5 metrics in the overview grid. */
export function MetricScoreCard({ metric, className }: MetricScoreCardProps) {
  const t = useTranslations('meetings.scoring');
  const color = GRADE_COLOR[metric.grade];
  const isAbove = metric.score >= metric.benchmark;

  const data = [
    { name: 'score', value: metric.score },
    { name: 'remaining', value: 100 - metric.score },
  ];

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm',
        'transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5',
        className,
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            name={METRIC_ICONS[metric.key] ?? 'analytics'}
            size={20}
            className="text-primary"
          />
          <h3 className="text-body-md text-on-surface font-semibold">{metric.label}</h3>
        </div>
        <GradeBadge grade={metric.grade} size="sm" />
      </div>

      {/* Donut chart */}
      <div className="mx-auto mb-3 h-24 w-24">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              innerRadius="72%"
              outerRadius="100%"
              dataKey="value"
              strokeWidth={0}
              animationBegin={0}
              animationDuration={900}
              animationEasing="ease-out"
            >
              <Cell fill={color} />
              <Cell fill="var(--color-surface-container-high, #dce9ff)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Score number */}
      <div className="mb-3 text-center">
        <span className="font-headline-md text-headline-md text-on-surface tabular-nums">
          {metric.score}
        </span>
        <span className="text-label-sm text-on-surface-variant ms-0.5">/100</span>
      </div>

      {/* Benchmark comparison */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-on-surface-variant font-medium">{t('benchmark')}</span>
          <span
            className={cn(
              'font-semibold',
              isAbove ? 'text-emerald-600' : 'text-amber-600',
            )}
          >
            {isAbove ? t('aboveBenchmark') : t('belowBenchmark')}
          </span>
        </div>
        <ProgressIndicator score={metric.score} benchmark={metric.benchmark} />
        <div className="flex justify-between text-[10px] text-on-surface-variant">
          <span>{t('yourScore')}: {metric.score}</span>
          <span>{t('industryAvg')}: {metric.benchmark}</span>
        </div>
      </div>
    </div>
  );
}
