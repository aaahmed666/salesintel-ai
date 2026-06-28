'use client';

import { useTranslations } from 'next-intl';
import { MEETING_SENTIMENT_META } from '@salesintel/config';
import type { MeetingSentiment } from '@salesintel/types';
import { Badge } from '@salesintel/ui';

/**
 * Color-coded sentiment chip with the AI score, mirroring the directory design
 * (e.g. "Positive (92)"). Falls back to a neutral dash when no score is present.
 */
export function SentimentBadge({
  sentiment,
  score,
}: {
  sentiment?: MeetingSentiment;
  score?: number;
}) {
  const t = useTranslations('meetings.sentiment');

  if (!sentiment) {
    return <span className="text-body-sm text-on-surface-variant">—</span>;
  }

  const meta = MEETING_SENTIMENT_META[sentiment];

  return (
    <Badge tone={meta.tone} className="rounded-full px-3 py-1">
      {t(sentiment)}
      {score !== undefined ? ` (${score})` : ''}
    </Badge>
  );
}
