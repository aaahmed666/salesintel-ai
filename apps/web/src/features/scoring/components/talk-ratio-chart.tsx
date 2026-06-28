'use client';

import { useTranslations } from 'next-intl';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import type { TalkRatioBreakdown } from '@salesintel/types';

interface TalkRatioChartProps {
  breakdown: TalkRatioBreakdown;
}

const COLORS = {
  self: '#4648d4',
  prospect: '#8455ef',
  silence: '#dce9ff',
};

/** Talk Ratio radial chart with three segments: Self, Prospect, Silence. */
export function TalkRatioChart({ breakdown }: TalkRatioChartProps) {
  const t = useTranslations('meetings.scoring');

  const data = [
    { name: t('you'), value: breakdown.selfPercent, color: COLORS.self },
    { name: t('prospect'), value: breakdown.prospectPercent, color: COLORS.prospect },
    { name: t('silence'), value: breakdown.silencePercent, color: COLORS.silence },
  ];

  return (
    <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm">
      <h3 className="text-body-md text-on-surface mb-4 font-semibold">
        {t('talkRatioBreakdown')}
      </h3>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="85%"
              dataKey="value"
              strokeWidth={2}
              stroke="var(--color-surface-container-lowest, #ffffff)"
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string, entry: any) => (
                <span className="text-body-sm text-on-surface">
                  {value}: <strong>{entry.payload?.value ?? 0}%</strong>
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Ideal range annotation */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">
          {t('idealRange')}: {breakdown.idealSelfRange[0]}–{breakdown.idealSelfRange[1]}% ({t('gongStandard')})
        </span>
      </div>
    </div>
  );
}
