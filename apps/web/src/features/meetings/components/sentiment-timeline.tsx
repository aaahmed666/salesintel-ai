'use client';

import { useTranslations } from 'next-intl';
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis } from 'recharts';
import type { SentimentPoint } from '@salesintel/types';
import { formatTimestamp } from '../hooks';

const POSITIVE = '#4648d4';
const FRICTION = '#e88a86';

/**
 * Sentiment-over-time bar chart. Positive segments use the brand primary while
 * friction (negative) bars switch to a muted red, mirroring the design legend.
 */
export function SentimentTimeline({ points }: { points: SentimentPoint[] }) {
  const t = useTranslations('meetings.details');

  const data = points.map((p) => ({
    label: formatTimestamp(p.timestamp),
    // Chart magnitude; sign drives the color.
    value: Math.abs(p.value) * 100,
    friction: p.value < 0,
  }));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-body-lg text-on-surface font-semibold">{t('sentimentTimeline')}</h3>
        <div className="text-label-sm text-on-surface-variant flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: POSITIVE }} />
            {t('positive')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: FRICTION }} />
            {t('friction')}
          </span>
        </div>
      </div>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
            barCategoryGap={6}
          >
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval={Math.max(0, Math.floor(data.length / 4) - 1)}
              tick={{ fontSize: 11, fill: '#464554' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.friction ? FRICTION : POSITIVE} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
