'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-label-sm font-semibold whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'bg-surface-container-high text-on-surface-variant',
        info: 'bg-primary-container/15 text-primary',
        progress: 'bg-secondary-container/15 text-secondary',
        success: 'bg-success-container text-on-success-container',
        warning: 'bg-amber-100 text-amber-800',
        error: 'bg-error-container text-on-error-container',
        outline: 'border border-outline-variant text-on-surface-variant',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { badgeVariants };
