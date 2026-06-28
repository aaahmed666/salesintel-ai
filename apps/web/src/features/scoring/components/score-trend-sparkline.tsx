'use client';

import { useTranslations } from 'next-intl';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { ScoreTrendPoint } from '@salesintel/types';

interface ScoreTrendSparklineProps {
  trend: ScoreTrendPoint[];
}

/** Score trend sparkline showing recent meeting scores as a smooth area chart. */
export function ScoreTrendSparkline({ trend }: ScoreTrendSparklineProps) {
  const t = useTranslations('meetings.scoring');

  const data = trend.map((point) => ({
    date: new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(
      new Date(point.date),
    ),
    score: point.score,
  }));

  return (
    <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm">
      <h3 className="text-body-md text-on-surface mb-4 font-semibold">{t('scoreTrend')}</h3>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4648d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4648d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#767586' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: '#767586' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: '1px solid #c7c4d7',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
              formatter={(value: number) => [`${value}`, t('overallScore')]}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#4648d4"
              strokeWidth={2}
              fill="url(#scoreFill)"
              dot={{ r: 3, fill: '#4648d4', stroke: '#ffffff', strokeWidth: 2 }}
              activeDot={{ r: 5, fill: '#4648d4', stroke: '#ffffff', strokeWidth: 2 }}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-on-surface-variant mt-2 text-center uppercase tracking-wider">
        {t('recentMeetings')}
      </p>
    </div>
  );
}
