'use client';

import { useTranslations } from 'next-intl';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { IndustryContext as IndustryContextData } from '@salesintel/types';
import { Icon } from '@/features/shell';
import { AnalysisSection } from './analysis-section';

interface IndustryContextProps {
  data: IndustryContextData;
}

/** "You vs sector benchmark" comparison + qualitative industry trends. */
export function IndustryContext({ data }: IndustryContextProps) {
  const t = useTranslations('meetings.deepDive.industry');
  const chartData = data.benchmarks.map((b) => ({
    label: b.label,
    deal: b.value,
    benchmark: b.benchmark,
  }));

  return (
    <AnalysisSection
      icon="insights"
      title={t('title')}
      summary={data.summary}
      aside={
        <span className="bg-surface-container-high text-on-surface-variant text-label-sm rounded-full px-3 py-1 font-medium">
          {data.sector}
        </span>
      }
    >
      <div className="border-outline-variant rounded-xl border p-4">
        <h3 className="text-body-md text-on-surface mb-3 font-semibold">{t('benchmarks')}</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5eeff" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#464554' }}
                interval={0}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#464554' }} />
              <Tooltip
                cursor={{ fill: '#eff4ff' }}
                contentStyle={{ borderRadius: 12, border: '1px solid #c7c4d7', fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="deal" name={t('thisDeal')} fill="#4648d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="benchmark" name={t('sectorAvg')} fill="#c0c1ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-body-md text-on-surface mb-2 font-semibold">{t('trends')}</h3>
        <ul className="space-y-2">
          {data.trends.map((trend, i) => (
            <li key={i} className="text-body-sm text-on-surface-variant flex items-start gap-2">
              <Icon name="trending_up" size={18} className="text-primary mt-0.5 flex-shrink-0" />
              {trend}
            </li>
          ))}
        </ul>
      </div>
    </AnalysisSection>
  );
}
