'use client';

import { cn } from '@salesintel/ui';
import { useOtpInput } from '../hooks';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  invalid?: boolean;
  disabled?: boolean;
}

/** Segmented one-time-code input matching the 2FA design. */
export function OtpInput({ value, onChange, length = 6, invalid, disabled }: OtpInputProps) {
  const { setRef, handleChange, handleKeyDown, handlePaste } = useOtpInput({
    value,
    onChange,
    length,
  });

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3" dir="ltr">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={setRef(i)}
          value={value[i] ?? ''}
          onChange={handleChange(i)}
          onKeyDown={handleKeyDown(i)}
          onPaste={handlePaste}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          className={cn(
            'otp-input h-14 w-12 rounded-md border bg-surface-container-lowest text-center font-display text-headline-md text-on-surface transition-shadow',
            'border-outline-variant focus:border-primary focus:shadow-focus-ring focus:outline-none',
            invalid && 'border-error',
            disabled && 'opacity-60',
          )}
        />
      ))}
    </div>
  );
}
