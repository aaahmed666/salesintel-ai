'use client';

import { useTranslations } from 'next-intl';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { GradeBadge } from './grade-badge';
import type { SalesGrade } from '@salesintel/types';

interface OverallScoreRingProps {
  score: number;
  grade: SalesGrade;
  previousScore?: number;
}

const GRADE_COLOR: Record<SalesGrade, string> = {
  'A+': '#10b981',
  A: '#4648d4',
  B: '#00628d',
  C: '#f59e0b',
  D: '#ba1a1a',
};

/**
 * Large radial chart showing the overall 0–100 score with letter grade overlay.
 * Uses Recharts PieChart configured as a donut gauge.
 */
export function OverallScoreRing({ score, grade, previousScore }: OverallScoreRingProps) {
  const t = useTranslations('meetings.scoring');
  const clamped = Math.max(0, Math.min(100, score));
  const delta = previousScore !== undefined ? score - previousScore : undefined;
  const color = GRADE_COLOR[grade];

  const data = [
    { name: 'score', value: clamped },
    { name: 'remaining', value: 100 - clamped },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-48 w-48 sm:h-56 sm:w-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              innerRadius="78%"
              outerRadius="100%"
              dataKey="value"
              strokeWidth={0}
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              <Cell fill={color} />
              <Cell fill="var(--color-surface-container-high, #dce9ff)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-headline-xl text-headline-xl text-on-surface tabular-nums">
            {clamped}
          </span>
          <span className="text-label-sm text-on-surface-variant mt-0.5 uppercase tracking-wide">
            {t('overallScore')}
          </span>
        </div>
      </div>

      <GradeBadge grade={grade} size="lg" />

      {delta !== undefined && (
        <span
          className={`text-label-sm font-semibold ${delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-error' : 'text-on-surface-variant'}`}
        >
          {delta > 0
            ? `↑ +${delta} ${t('previousScore')}`
            : delta < 0
              ? `↓ ${delta} ${t('previousScore')}`
              : t('noChange')}
        </span>
      )}
    </div>
  );
}
