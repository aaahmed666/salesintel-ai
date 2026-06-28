'use client';

import type { ReactNode } from 'react';
import { cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';

export type InsightTone = 'positive' | 'neutral' | 'risk' | 'primary';

const TONE: Record<InsightTone, { card: string; icon: string; title: string }> = {
  positive: { card: 'bg-tertiary-container/10 border-tertiary/20', icon: 'text-tertiary', title: 'text-tertiary' },
  neutral: { card: 'bg-surface-container-low border-outline-variant', icon: 'text-on-surface-variant', title: 'text-on-surface' },
  risk: { card: 'bg-error-container/30 border-error/20', icon: 'text-error', title: 'text-error' },
  primary: { card: 'bg-surface-container-high border-primary/20', icon: 'text-primary', title: 'text-primary' },
};

interface InsightCardProps {
  icon: string;
  title: string;
  tone?: InsightTone;
  iconFilled?: boolean;
  children: ReactNode;
  className?: string;
}

/** Compact titled card used across the deep dive (AI context highlights, etc.). */
export function InsightCard({
  icon,
  title,
  tone = 'neutral',
  iconFilled,
  children,
  className,
}: InsightCardProps) {
  const styles = TONE[tone];
  return (
    <div className={cn('rounded-xl border p-4', styles.card, className)}>
      <div className="mb-2 flex items-center gap-2">
        <Icon name={icon} size={18} filled={iconFilled} className={styles.icon} />
        <h3 className={cn('text-body-md font-semibold', styles.title)}>{title}</h3>
      </div>
      <div className="text-body-sm text-on-surface-variant">{children}</div>
    </div>
  );
}
