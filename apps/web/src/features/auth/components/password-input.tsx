'use client';

import { forwardRef, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input, type InputProps } from '@salesintel/ui';

/**
 * Password field with a lock leading icon and a show/hide toggle. Forwards refs
 * so React Hook Form's `register` works directly.
 */
export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    return (
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        invalid={invalid}
        startIcon={<Lock className="h-5 w-5" />}
        endAdornment={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="text-on-surface-variant transition-colors hover:text-on-surface"
            aria-label={visible ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        }
        {...props}
      />
    );
  },
);
PasswordInput.displayName = 'PasswordInput';
