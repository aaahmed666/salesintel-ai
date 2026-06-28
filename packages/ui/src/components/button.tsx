'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-display font-medium transition-all focus-visible:outline-none focus-visible:shadow-focus-ring disabled:pointer-events-none disabled:opacity-60 active:scale-[0.99]',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary hover:bg-primary-container shadow-sm',
        gradient:
          'bg-primary-gradient text-on-primary hover:opacity-95 shadow-sm',
        secondary:
          'border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low',
        ghost: 'text-on-surface hover:bg-surface-container-low',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-sm text-body-sm',
        md: 'h-11 px-md text-body-md',
        lg: 'h-12 px-lg text-body-md',
        icon: 'h-11 w-11',
      },
      fullWidth: { true: 'w-full' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, fullWidth, asChild = false, loading = false, children, disabled, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
