'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import type { TranscriptEntry } from '@salesintel/types';

export interface TranscriptSearch {
  query: string;
  setQuery: (value: string) => void;
  clear: () => void;
  /** Ordered ids of entries that match the current query. */
  matchIds: string[];
  /** Index into matchIds of the focused match (-1 when none). */
  activeIndex: number;
  /** Id of the focused match, or null. */
  activeId: string | null;
  next: () => void;
  previous: () => void;
  /** Register an entry's DOM node so we can scroll to it. */
  registerEntry: (id: string, node: HTMLLIElement | null) => void;
}

/**
 * Headless transcript search: debounce-free (cheap in-memory filtering), tracks
 * a "current match" with wrap-around next/previous, and scrolls the active
 * match into view. Works the same in LTR and RTL.
 */
export function useTranscriptSearch(entries: TranscriptEntry[]): TranscriptSearch {
  const [query, setQueryState] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const nodes = useRef(new Map<string, HTMLLIElement>());

  const matchIds = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return entries.filter((e) => e.text.toLowerCase().includes(q)).map((e) => e.id);
  }, [entries, query]);

  const scrollTo = useCallback((id: string | undefined) => {
    if (!id) return;
    const node = nodes.current.get(id);
    node?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const setQuery = useCallback(
    (value: string) => {
      setQueryState(value);
      const q = value.trim().toLowerCase();
      const ids = q
        ? entries.filter((e) => e.text.toLowerCase().includes(q)).map((e) => e.id)
        : [];
      const nextIndex = ids.length > 0 ? 0 : -1;
      setActiveIndex(nextIndex);
      if (nextIndex >= 0) scrollTo(ids[nextIndex]);
    },
    [entries, scrollTo],
  );

  const clear = useCallback(() => {
    setQueryState('');
    setActiveIndex(-1);
  }, []);

  const next = useCallback(() => {
    if (matchIds.length === 0) return;
    setActiveIndex((i) => {
      const ni = (i + 1) % matchIds.length;
      scrollTo(matchIds[ni]);
      return ni;
    });
  }, [matchIds, scrollTo]);

  const previous = useCallback(() => {
    if (matchIds.length === 0) return;
    setActiveIndex((i) => {
      const pi = (i - 1 + matchIds.length) % matchIds.length;
      scrollTo(matchIds[pi]);
      return pi;
    });
  }, [matchIds, scrollTo]);

  const registerEntry = useCallback((id: string, node: HTMLLIElement | null) => {
    if (node) nodes.current.set(id, node);
    else nodes.current.delete(id);
  }, []);

  const activeId = activeIndex >= 0 ? (matchIds[activeIndex] ?? null) : null;

  return {
    query,
    setQuery,
    clear,
    matchIds,
    activeIndex,
    activeId,
    next,
    previous,
    registerEntry,
  };
}
