import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '../lib/cn';

const alertVariants = cva(
  'flex items-start gap-2 rounded-md border px-md py-sm text-body-sm',
  {
    variants: {
      variant: {
        error: 'border-error/30 bg-error-container/60 text-on-error-container',
        success: 'border-success/30 bg-success-container/60 text-on-success-container',
        info: 'border-primary/20 bg-surface-container-low text-on-surface',
      },
    },
    defaultVariants: { variant: 'info' },
  },
);

const icons = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
} as const;

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export function Alert({ className, variant = 'info', children, ...props }: AlertProps) {
  const Icon = icons[variant ?? 'info'];
  return (
    <div role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <span className="leading-snug">{children}</span>
    </div>
  );
}
