'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import type { ObjectionDetail, ObjectionSeverity } from '@salesintel/types';
import { cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import { AnalysisSection } from './analysis-section';

const SEVERITY_COLOR: Record<ObjectionSeverity, string> = {
  high: '#ba1a1a',
  medium: '#e88a86',
  low: '#c0c1ff',
};

const SEVERITY_BADGE: Record<ObjectionSeverity, string> = {
  high: 'bg-error-container/60 text-on-error-container',
  medium: 'bg-error-container/30 text-error',
  low: 'bg-surface-container-high text-on-surface-variant',
};

interface ObjectionAnalysisProps {
  objections: ObjectionDetail[];
  summary: string;
}

/** Objection severity distribution + per-objection handling + recommendation. */
export function ObjectionAnalysis({ objections, summary }: ObjectionAnalysisProps) {
  const t = useTranslations('meetings.deepDive.objection');

  const distribution = useMemo(() => {
    const counts: Record<ObjectionSeverity, number> = { high: 0, medium: 0, low: 0 };
    for (const o of objections) counts[o.severity] += 1;
    return (Object.keys(counts) as ObjectionSeverity[])
      .map((k) => ({ key: k, value: counts[k], color: SEVERITY_COLOR[k] }))
      .filter((d) => d.value > 0);
  }, [objections]);

  if (objections.length === 0) {
    return (
      <AnalysisSection icon="report" title={t('title')}>
        <div className="text-on-surface-variant flex flex-col items-center gap-2 py-10 text-center">
          <Icon name="check_circle" size={28} className="text-tertiary" />
          <p className="text-body-sm">{t('empty')}</p>
        </div>
      </AnalysisSection>
    );
  }

  return (
    <AnalysisSection
      icon="report"
      title={t('title')}
      summary={summary}
      aside={
        <span className="bg-error-container/40 text-on-error-container text-label-sm rounded-full px-3 py-1 font-semibold">
          {t('count', { count: objections.length })}
        </span>
      }
    >
      <div className="gap-lg grid grid-cols-1 lg:grid-cols-[200px_1fr]">
        <div className="border-outline-variant flex flex-col items-center rounded-xl border p-4">
          <div className="h-32 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribution} dataKey="value" innerRadius={36} outerRadius={56} stroke="none">
                  {distribution.map((d) => (
                    <Cell key={d.key} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1">
            {distribution.map((d) => (
              <li key={d.key} className="text-label-sm flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-on-surface-variant">{t(`severity.${d.key}`)}</span>
                <span className="text-on-surface ms-auto font-semibold tabular-nums">{d.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="space-y-3">
          {objections.map((o) => (
            <li key={o.id} className="border-outline-variant rounded-xl border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-body-md text-on-surface font-semibold">{o.title}</span>
                <span
                  className={cn(
                    'text-label-sm rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide',
                    SEVERITY_BADGE[o.severity],
                  )}
                >
                  {t(`severity.${o.severity}`)}
                </span>
                <span
                  className={cn(
                    'text-label-sm ms-auto inline-flex items-center gap-1 font-medium',
                    o.status === 'addressed' ? 'text-tertiary' : 'text-on-surface-variant',
                  )}
                >
                  <Icon
                    name={o.status === 'addressed' ? 'check_circle' : 'pending'}
                    size={14}
                    filled={o.status === 'addressed'}
                  />
                  {t(`status.${o.status}`)}
                </span>
              </div>
              <p className="text-body-sm text-on-surface-variant border-outline-variant mt-2 border-s-2 ps-3 italic">
                {o.quote}
              </p>
              <div className="bg-surface-container-low mt-3 flex items-start gap-2 rounded-lg p-3">
                <Icon name="lightbulb" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <p className="text-body-sm text-on-surface-variant">
                  <span className="text-on-surface font-semibold">{t('recommendation')}: </span>
                  {o.recommendation}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AnalysisSection>
  );
}
