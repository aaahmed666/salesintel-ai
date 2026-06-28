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

interface MetricBreakdownCardProps {
  metric: ScoringMetric;
  className?: string;
}

/** Expanded breakdown card for the detail view with strengths & improvements. */
export function MetricBreakdownCard({ metric, className }: MetricBreakdownCardProps) {
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
        'rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm',
        'transition-all duration-300',
        className,
      )}
    >
      {/* Header row */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Icon
              name={METRIC_ICONS[metric.key] ?? 'analytics'}
              size={22}
              className="text-primary"
            />
          </div>
          <div>
            <h3 className="text-body-md text-on-surface font-semibold">{metric.label}</h3>
            <p className="text-body-sm text-on-surface-variant mt-0.5">{metric.description}</p>
          </div>
        </div>
        <GradeBadge grade={metric.grade} size="md" />
      </div>

      <div className="gap-lg grid grid-cols-1 lg:grid-cols-[200px_1fr]">
        {/* Score ring */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-32 w-32">
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
                >
                  <Cell fill={color} />
                  <Cell fill="var(--color-surface-container-high, #dce9ff)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center">
            <span className="font-headline-md text-headline-md text-on-surface tabular-nums">
              {metric.score}
            </span>
            <span className="text-label-sm text-on-surface-variant ms-0.5">/100</span>
          </div>
          {/* Benchmark bar */}
          <div className="w-full max-w-[180px] space-y-1.5">
            <ProgressIndicator score={metric.score} benchmark={metric.benchmark} />
            <div className="flex justify-between text-[10px] text-on-surface-variant">
              <span>{t('yourScore')}: {metric.score}</span>
              <span>{t('industryAvg')}: {metric.benchmark}</span>
            </div>
            <div className="text-center">
              <span
                className={cn(
                  'text-[10px] font-semibold',
                  isAbove ? 'text-emerald-600' : 'text-amber-600',
                )}
              >
                {isAbove ? t('aboveBenchmark') : t('belowBenchmark')}
              </span>
            </div>
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="space-y-4">
          {/* Strengths */}
          <div>
            <h4 className="text-label-sm text-emerald-600 mb-2 flex items-center gap-1.5 font-semibold uppercase tracking-wide">
              <Icon name="check_circle" size={16} filled className="text-emerald-600" />
              {t('strengths')}
            </h4>
            <ul className="space-y-1.5">
              {metric.strengths.map((s, i) => (
                <li
                  key={i}
                  className="text-body-sm text-on-surface-variant flex items-start gap-2"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div>
            <h4 className="text-label-sm text-amber-600 mb-2 flex items-center gap-1.5 font-semibold uppercase tracking-wide">
              <Icon name="arrow_upward" size={16} className="text-amber-600" />
              {t('improvements')}
            </h4>
            <ul className="space-y-1.5">
              {metric.improvements.map((imp, i) => (
                <li
                  key={i}
                  className="text-body-sm text-on-surface-variant flex items-start gap-2"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  {imp}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
