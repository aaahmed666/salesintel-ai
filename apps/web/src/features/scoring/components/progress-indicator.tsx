'use client';

import { cn } from '@salesintel/ui';

interface ProgressIndicatorProps {
  /** 0–100 actual score. */
  score: number;
  /** 0–100 benchmark value. */
  benchmark: number;
  className?: string;
}

/**
 * Dual-layer progress bar: filled bar for actual score, dashed line for benchmark.
 * Color shifts based on whether the score exceeds or falls short of the benchmark.
 */
export function ProgressIndicator({ score, benchmark, className }: ProgressIndicatorProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const benchClamped = Math.max(0, Math.min(100, benchmark));
  const isAbove = clamped >= benchClamped;

  return (
    <div className={cn('w-full', className)}>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
        {/* Actual score fill */}
        <div
          className={cn(
            'absolute inset-y-0 start-0 rounded-full transition-all duration-700 ease-out',
            isAbove
              ? 'bg-gradient-to-r from-primary to-emerald-500'
              : 'bg-gradient-to-r from-amber-500 to-error',
          )}
          style={{ width: `${clamped}%` }}
        />
        {/* Benchmark marker */}
        <div
          className="absolute inset-y-0 w-0.5 bg-on-surface/60"
          style={{ insetInlineStart: `${benchClamped}%` }}
          title={`Benchmark: ${benchClamped}%`}
        />
      </div>
    </div>
  );
}
