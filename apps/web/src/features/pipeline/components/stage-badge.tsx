'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@salesintel/ui';
import type { PipelineStage } from '@salesintel/types';

const STAGE_STYLES: Record<PipelineStage, { dot: string; bg: string; text: string }> = {
  lead:        { dot: 'bg-outline-variant', bg: 'bg-gray-100',      text: 'text-gray-700' },
  qualified:   { dot: 'bg-tertiary',        bg: 'bg-cyan-50',       text: 'text-tertiary' },
  proposal:    { dot: 'bg-secondary',       bg: 'bg-purple-50',     text: 'text-secondary' },
  negotiation: { dot: 'bg-primary',         bg: 'bg-indigo-50',     text: 'text-primary' },
  won:         { dot: 'bg-green-500',       bg: 'bg-green-50',      text: 'text-green-700' },
  lost:        { dot: 'bg-error',           bg: 'bg-red-50',        text: 'text-error' },
};

interface StageBadgeProps {
  stage: PipelineStage;
  size?: 'sm' | 'md';
  className?: string;
}

/** Colored pill badge for pipeline stages. */
export function StageBadge({ stage, size = 'md', className }: StageBadgeProps) {
  const t = useTranslations('pipeline.stages');
  const styles = STAGE_STYLES[stage];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wide',
        styles.bg, styles.text,
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-label-sm',
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', styles.dot)} />
      {t(stage as never)}
    </span>
  );
}

export { STAGE_STYLES };
