'use client';

import type { ReactNode } from 'react';
import { Label } from '@salesintel/ui';

interface FormFieldProps {
  id: string;
  label: string;
  /** Optional action rendered at the inline-end of the label row (e.g. "Forgot password?"). */
  action?: ReactNode;
  error?: string;
  hint?: string;
  children: ReactNode;
  /** Render the label uppercase (matches the register/forgot designs). */
  uppercaseLabel?: boolean;
}

export function FormField({
  id,
  label,
  action,
  error,
  hint,
  children,
  uppercaseLabel,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className={uppercaseLabel ? 'uppercase tracking-wide' : undefined}>
          {label}
        </Label>
        {action}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-body-sm text-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-body-sm text-on-surface-variant">{hint}</p>
      ) : null}
    </div>
  );
}
