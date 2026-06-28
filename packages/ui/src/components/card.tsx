import * as React from 'react';
import { cn } from '../lib/cn';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-lg shadow-card',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export const GlassCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-white/40 bg-white/80 p-lg shadow-elevated backdrop-blur-md',
        className,
      )}
      {...props}
    />
  ),
);
GlassCard.displayName = 'GlassCard';
