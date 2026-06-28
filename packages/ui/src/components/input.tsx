'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional icon rendered at the inline-start edge. */
  startIcon?: React.ReactNode;
  /** Optional node (e.g. password toggle) rendered at the inline-end edge. */
  endAdornment?: React.ReactNode;
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, startIcon, endAdornment, invalid, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex h-12 items-center gap-2 rounded-md border bg-surface-container-lowest px-md transition-shadow',
          'border-outline-variant focus-within:border-primary focus-within:shadow-focus-ring',
          invalid && 'border-error focus-within:border-error focus-within:shadow-none',
          className,
        )}
      >
        {startIcon && (
          <span className="flex shrink-0 text-on-surface-variant" aria-hidden>
            {startIcon}
          </span>
        )}
        <input
          ref={ref}
          aria-invalid={invalid || undefined}
          className="h-full w-full bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant/60"
          {...props}
        />
        {endAdornment && <span className="flex shrink-0">{endAdornment}</span>}
      </div>
    );
  },
);
Input.displayName = 'Input';
