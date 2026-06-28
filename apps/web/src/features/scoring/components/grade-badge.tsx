'use client';

import { cn } from '@salesintel/ui';
import type { SalesGrade } from '@salesintel/types';

const GRADE_STYLES: Record<SalesGrade, { bg: string; text: string; border: string }> = {
  'A+': {
    bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    text: 'text-white',
    border: 'border-emerald-400/30',
  },
  A: {
    bg: 'bg-primary',
    text: 'text-on-primary',
    border: 'border-primary/30',
  },
  B: {
    bg: 'bg-tertiary',
    text: 'text-on-tertiary',
    border: 'border-tertiary/30',
  },
  C: {
    bg: 'bg-amber-500',
    text: 'text-white',
    border: 'border-amber-400/30',
  },
  D: {
    bg: 'bg-error',
    text: 'text-on-error',
    border: 'border-error/30',
  },
};

interface GradeBadgeProps {
  grade: SalesGrade;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/** Colored pill badge displaying a letter grade (A+ through D). */
export function GradeBadge({ grade, size = 'md', className }: GradeBadgeProps) {
  const styles = GRADE_STYLES[grade];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-label-sm',
    lg: 'px-4 py-1.5 text-body-md',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-bold tracking-wide',
        'animate-[scale-bounce_0.3s_ease-out]',
        styles.bg,
        styles.text,
        styles.border,
        sizeClasses[size],
        className,
      )}
    >
      {grade}
    </span>
  );
}
