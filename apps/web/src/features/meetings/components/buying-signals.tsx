'use client';

import { useTranslations } from 'next-intl';
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from 'recharts';
import type { BuyingSignalsSection } from '@salesintel/types';
import { Icon } from '@/features/shell';
import { AnalysisSection } from './analysis-section';

const CATEGORY_ICON = {
  timeline: 'schedule',
  budget: 'payments',
  authority: 'badge',
  need: 'target',
} as const;

interface BuyingSignalsProps {
  data: BuyingSignalsSection;
}

/** Overall buying-intent gauge + ranked individual signals with evidence. */
export function BuyingSignals({ data }: BuyingSignalsProps) {
  const t = useTranslations('meetings.deepDive.buyingSignals');
  const gauge = [{ name: 'score', value: data.score, fill: '#4648d4' }];
  const signals = [...data.signals].sort((a, b) => b.strength - a.strength);

  return (
    <AnalysisSection icon="trending_up" title={t('title')} summary={data.summary}>
      <div className="gap-lg grid grid-cols-1 lg:grid-cols-[200px_1fr]">
        {/* Overall gauge */}
        <div className="border-outline-variant flex flex-col items-center justify-center rounded-xl border p-4">
          <div className="relative h-40 w-40">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="72%"
                outerRadius="100%"
                data={gauge}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={12} background={{ fill: '#e5eeff' }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-headline-md text-primary font-bold tabular-nums">{data.score}%</span>
              <span className="text-label-sm text-on-surface-variant">{t('intent')}</span>
            </div>
          </div>
        </div>

        {/* Individual signals */}
        <ul className="space-y-3">
          {signals.map((s) => (
            <li key={s.id} className="border-outline-variant rounded-xl border p-3">
              <div className="flex items-center gap-2">
                <Icon name={CATEGORY_ICON[s.category]} size={18} className="text-primary" />
                <span className="text-body-sm text-on-surface font-semibold">{s.label}</span>
                <span className="text-label-sm text-on-surface-variant ms-auto font-semibold tabular-nums">
                  {s.strength}%
                </span>
              </div>
              <div className="bg-surface-container my-2 h-1.5 w-full overflow-hidden rounded-full">
                <div className="bg-primary h-full rounded-full" style={{ width: `${s.strength}%` }} />
              </div>
              <p className="text-label-sm text-on-surface-variant">{s.evidence}</p>
            </li>
          ))}
        </ul>
      </div>
    </AnalysisSection>
  );
}
