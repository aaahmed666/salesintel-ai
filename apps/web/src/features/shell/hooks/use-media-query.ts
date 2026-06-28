'use client';

import { useEffect, useState } from 'react';

/**
 * SSR-safe media query hook. Returns false during SSR and the first client
 * render, then syncs to the real match to avoid hydration mismatches.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Tailwind `lg` breakpoint (1024px) — desktop vs. tablet/mobile. */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
