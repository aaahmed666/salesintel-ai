'use client';

import { useCallback, useRef } from 'react';
import { TWO_FACTOR_CODE_LENGTH } from '@salesintel/config';

interface UseOtpInputArgs {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

/**
 * Manages a segmented one-time-code input: per-box refs, auto-advance,
 * backspace-to-previous, full-code paste, and arrow navigation. Direction is
 * handled by the DOM (RTL flips visual order automatically).
 */
export function useOtpInput({ value, onChange, length = TWO_FACTOR_CODE_LENGTH }: UseOtpInputArgs) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const setRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      refs.current[index] = el;
    },
    [],
  );

  const focusBox = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, length - 1));
    refs.current[clamped]?.focus();
    refs.current[clamped]?.select();
  }, [length]);

  const setCharAt = useCallback(
    (index: number, char: string) => {
      const next = value.split('');
      next[index] = char;
      onChange(next.join('').slice(0, length));
    },
    [value, onChange, length],
  );

  const handleChange = useCallback(
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '');
      if (!raw) {
        setCharAt(index, '');
        return;
      }
      // If multiple digits arrive (autofill), distribute them.
      if (raw.length > 1) {
        const merged = (value.slice(0, index) + raw).slice(0, length);
        onChange(merged);
        focusBox(merged.length);
        return;
      }
      setCharAt(index, raw);
      if (index < length - 1) focusBox(index + 1);
    },
    [setCharAt, value, onChange, length, focusBox],
  );

  const handleKeyDown = useCallback(
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !value[index] && index > 0) {
        focusBox(index - 1);
      } else if (e.key === 'ArrowLeft') {
        focusBox(index - 1);
      } else if (e.key === 'ArrowRight') {
        focusBox(index + 1);
      }
    },
    [value, focusBox],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      if (pasted) {
        onChange(pasted);
        focusBox(pasted.length);
      }
    },
    [onChange, length, focusBox],
  );

  return { refs, setRef, handleChange, handleKeyDown, handlePaste, length };
}
