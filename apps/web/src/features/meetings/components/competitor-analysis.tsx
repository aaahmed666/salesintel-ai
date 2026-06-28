'use client';

import { useTranslations } from 'next-intl';
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { CompetitorMention } from '@salesintel/types';
import { cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import { AnalysisSection } from './analysis-section';

interface CompetitorAnalysisProps {
  competitors: CompetitorMention[];
  summary: string;
}

/** Competitor mention-share chart + per-competitor context cards. */
export function CompetitorAnalysis({ competitors, summary }: CompetitorAnalysisProps) {
  const t = useTranslations('meetings.deepDive.competitor');
  const data = competitors.map((c) => ({
    name: c.name,
    mentions: c.mentions,
    favorable: c.favorable,
  }));

  if (competitors.length === 0) {
    return (
      <AnalysisSection icon="swords" title={t('title')}>
        <EmptyHint icon="swords" text={t('empty')} />
      </AnalysisSection>
    );
  }

  return (
    <AnalysisSection icon="swords" title={t('title')} summary={summary}>
      <div className="gap-lg grid grid-cols-1 lg:grid-cols-2">
        <div className="border-outline-variant rounded-xl border p-4">
          <h3 className="text-body-md text-on-surface mb-3 font-semibold">{t('mentionShare')}</h3>
          <div style={{ height: Math.max(120, data.length * 56) }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={96}
                  tick={{ fontSize: 12, fill: '#464554' }}
                />
                <Bar dataKey="mentions" radius={[0, 4, 4, 0]} barSize={20}>
                  {data.map((d, i) => (
                    <Cell key={i} fill={d.favorable ? '#00628d' : '#ba1a1a'} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <ul className="space-y-3">
          {competitors.map((c) => (
            <li key={c.id} className="border-outline-variant rounded-xl border p-3">
              <div className="flex items-center justify-between">
                <span className="text-body-md text-on-surface font-semibold">{c.name}</span>
                <span
                  className={cn(
                    'text-label-sm rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide',
                    c.favorable
                      ? 'bg-tertiary-container/20 text-tertiary'
                      : 'bg-error-container/60 text-on-error-container',
                  )}
                >
                  {c.favorable ? t('favorable') : t('threat')}
                </span>
              </div>
              <p className="text-body-sm text-on-surface-variant mt-1">{c.context}</p>
              <p className="text-label-sm text-on-surface-variant mt-2">
                {t('mentions', { count: c.mentions })}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </AnalysisSection>
  );
}

function EmptyHint({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="text-on-surface-variant flex flex-col items-center gap-2 py-10 text-center">
      <Icon name={icon} size={28} className="opacity-50" />
      <p className="text-body-sm max-w-xs">{text}</p>
    </div>
  );
}
