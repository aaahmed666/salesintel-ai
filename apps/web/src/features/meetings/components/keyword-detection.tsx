'use client';

import { useTranslations } from 'next-intl';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { KeywordCategory, KeywordFrequency } from '@salesintel/types';
import { AnalysisSection } from './analysis-section';
import { Icon } from '@/features/shell';

const CATEGORY_COLOR: Record<KeywordCategory, string> = {
  product: '#4648d4',
  pricing: '#6b38d4',
  competitor: '#ba1a1a',
  risk: '#e88a86',
  process: '#00628d',
};

const CATEGORY_ORDER: KeywordCategory[] = ['product', 'pricing', 'competitor', 'risk', 'process'];

interface KeywordDetectionProps {
  keywords: KeywordFrequency[];
  summary: string;
}

/** Detected-keyword frequency chart, coloured + legended by theme. */
export function KeywordDetection({ keywords, summary }: KeywordDetectionProps) {
  const t = useTranslations('meetings.deepDive.keyword');

  if (keywords.length === 0) {
    return (
      <AnalysisSection icon="tag" title={t('title')}>
        <div className="text-on-surface-variant flex flex-col items-center gap-2 py-10 text-center">
          <Icon name="tag" size={28} className="opacity-50" />
          <p className="text-body-sm">{t('empty')}</p>
        </div>
      </AnalysisSection>
    );
  }

  const data = [...keywords].sort((a, b) => b.count - a.count);

  return (
    <AnalysisSection icon="tag" title={t('title')} summary={summary}>
      <div className="border-outline-variant rounded-xl border p-4">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#464554' }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={56}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#464554' }} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: '#eff4ff' }}
                contentStyle={{ borderRadius: 12, border: '1px solid #c7c4d7', fontSize: 12 }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={28}>
                {data.map((d) => (
                  <Cell key={d.id} fill={CATEGORY_COLOR[d.category]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {CATEGORY_ORDER.map((cat) => (
          <span key={cat} className="text-label-sm text-on-surface-variant inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLOR[cat] }} />
            {t(`categories.${cat}`)}
          </span>
        ))}
      </div>
    </AnalysisSection>
  );
}
