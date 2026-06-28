'use client';

import { useTranslations } from 'next-intl';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import type { SentimentSection } from '@salesintel/types';
import { AnalysisSection } from './analysis-section';
import { SentimentTimeline } from './sentiment-timeline';
import { ScoreRing } from './score-ring';

const COLORS = { positive: '#4648d4', neutral: '#c7c4d7', negative: '#ba1a1a' };

interface SentimentAnalysisProps {
  data: SentimentSection;
}

/** Sentiment breakdown donut + sentiment-over-time + talk ratio + quality. */
export function SentimentAnalysis({ data }: SentimentAnalysisProps) {
  const t = useTranslations('meetings.deepDive.sentiment');
  const breakdown = [
    { key: 'positive', value: data.breakdown.positive, color: COLORS.positive },
    { key: 'neutral', value: data.breakdown.neutral, color: COLORS.neutral },
    { key: 'negative', value: data.breakdown.negative, color: COLORS.negative },
  ];

  return (
    <AnalysisSection icon="sentiment_satisfied" title={t('title')} summary={data.summary}>
      <div className="gap-lg grid grid-cols-1 lg:grid-cols-2">
        {/* Breakdown donut */}
        <div className="border-outline-variant rounded-xl border p-4">
          <h3 className="text-body-md text-on-surface mb-2 font-semibold">{t('breakdown')}</h3>
          <div className="flex items-center gap-4">
            <div className="h-36 w-36 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown}
                    dataKey="value"
                    innerRadius={42}
                    outerRadius={64}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {breakdown.map((d) => (
                      <Cell key={d.key} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2">
              {breakdown.map((d) => (
                <li key={d.key} className="text-body-sm flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-on-surface-variant">{t(d.key)}</span>
                  <span className="text-on-surface ms-auto font-semibold tabular-nums">{d.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Talk ratio + quality */}
        <div className="border-outline-variant rounded-xl border p-4">
          <h3 className="text-body-md text-on-surface mb-3 font-semibold">{t('talkRatio')}</h3>
          <TalkRatioBar label={t('you')} value={data.talkRatio.self} color={COLORS.positive} />
          <TalkRatioBar
            label={t('prospect')}
            value={data.talkRatio.prospect}
            color="#6b38d4"
          />
          <p className="text-label-sm text-on-surface-variant mt-2">{t('healthyBalance')}</p>
          <div className="border-outline-variant mt-4 flex items-center gap-4 border-t pt-4">
            <ScoreRing score={data.qualityScore} propensityLabel={t('qualityScore')} />
          </div>
        </div>
      </div>

      <div className="border-outline-variant mt-4 rounded-xl border p-4">
        <SentimentTimeline points={data.timeline} />
      </div>
    </AnalysisSection>
  );
}

function TalkRatioBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="mb-3">
      <div className="text-body-sm mb-1 flex justify-between">
        <span className="text-on-surface-variant">{label}</span>
        <span className="text-on-surface font-semibold tabular-nums">{value}%</span>
      </div>
      <div className="bg-surface-container h-2 w-full overflow-hidden rounded-full">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
