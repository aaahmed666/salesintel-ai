'use client';

import { useCallback, useEffect, useState } from 'react';
import { RESEND_COOLDOWN_SECONDS } from '@salesintel/config';

/**
 * Countdown timer for "resend code / email" buttons. Returns the remaining
 * seconds and a `start` trigger to (re)begin the cooldown.
 */
export function useResendCooldown(seconds: number = RESEND_COOLDOWN_SECONDS) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = window.setInterval(() => {
      setRemaining((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [remaining]);

  const start = useCallback(() => setRemaining(seconds), [seconds]);

  return { remaining, isCoolingDown: remaining > 0, start };
}
