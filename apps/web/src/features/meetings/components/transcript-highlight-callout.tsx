'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@salesintel/ui';
import type { TranscriptHighlight, TranscriptHighlightKind } from '@salesintel/types';
import { Icon } from '@/features/shell';

/**
 * Per-category presentation, lifted verbatim from the Stitch design:
 *  - objection     → error container, warning triangle
 *  - upsell        → tertiary (blue) container, lightbulb
 *  - buying-signal → primary-tinted container, filled star
 */
const KIND_STYLES: Record<
  TranscriptHighlightKind,
  { container: string; icon: string; iconWrap: string; title: string; body: string; symbol: string; filled?: boolean }
> = {
  objection: {
    container: 'bg-error-container/40 border-error/20',
    iconWrap: 'text-error',
    icon: 'text-error',
    title: 'text-error',
    body: 'text-on-error-container/90',
    symbol: 'warning',
  },
  upsell: {
    container: 'bg-tertiary-container/10 border-tertiary/20',
    iconWrap: 'text-tertiary',
    icon: 'text-tertiary',
    title: 'text-tertiary',
    body: 'text-on-surface-variant',
    symbol: 'lightbulb',
  },
  'buying-signal': {
    container: 'bg-surface-container-high border-primary/20',
    iconWrap: 'text-primary',
    icon: 'text-primary',
    title: 'text-primary',
    body: 'text-on-surface-variant',
    symbol: 'star',
    filled: true,
  },
};

interface TranscriptHighlightCalloutProps {
  highlight: TranscriptHighlight;
}

/** Inline AI moment rendered beneath the utterance that triggered it. */
export function TranscriptHighlightCallout({ highlight }: TranscriptHighlightCalloutProps) {
  const t = useTranslations('meetings.transcript.highlight');
  const styles = KIND_STYLES[highlight.kind];
  const title = highlight.titleKey ? t(highlight.titleKey) : highlight.title;

  return (
    <div
      role="note"
      className={cn(
        'mt-3 flex items-start gap-3 rounded-xl border p-md',
        styles.container,
      )}
    >
      <Icon
        name={styles.symbol}
        size={20}
        filled={styles.filled}
        className={cn('mt-0.5 flex-shrink-0', styles.icon)}
      />
      <div className="min-w-0">
        <p className={cn('text-label-sm font-semibold uppercase tracking-wide', styles.title)}>
          {title}
        </p>
        <p className={cn('text-body-sm mt-1', styles.body)}>{highlight.detail}</p>
      </div>
    </div>
  );
}
