'use client';

import { Fragment, useMemo } from 'react';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

interface Segment {
  text: string;
  /** AI-surfaced keyword (emphasised, primary). */
  keyword: boolean;
  /** Matches the active search query (marked). */
  match: boolean;
}

interface TranscriptKeywordTextProps {
  text: string;
  /** Substrings the AI flagged as meaningful keywords. */
  keywords?: string[];
  /** Active search query to highlight live. */
  query?: string;
}

/**
 * Renders an utterance with two overlaid kinds of emphasis:
 *  - AI keywords → primary, medium weight (the "Competitor X" links in the design)
 *  - live search matches → a marked background
 * Search matches win visually so users can always see what they searched for.
 * Tokenisation is locale-agnostic, so it works identically in LTR and RTL.
 */
export function TranscriptKeywordText({ text, keywords, query }: TranscriptKeywordTextProps) {
  const segments = useMemo<Segment[]>(() => {
    const terms: { value: string; keyword: boolean; match: boolean }[] = [];
    const trimmedQuery = query?.trim();
    if (trimmedQuery) terms.push({ value: trimmedQuery, keyword: false, match: true });
    for (const kw of keywords ?? []) {
      if (kw.trim()) terms.push({ value: kw.trim(), keyword: true, match: false });
    }
    if (terms.length === 0) return [{ text, keyword: false, match: false }];

    // Longest-first so multi-word terms win over their sub-words.
    terms.sort((a, b) => b.value.length - a.value.length);
    const pattern = terms.map((t) => escapeRegExp(t.value)).join('|');
    const re = new RegExp(`(${pattern})`, 'gi');

    const out: Segment[] = [];
    let last = 0;
    for (const m of text.matchAll(re)) {
      const start = m.index ?? 0;
      if (start > last) out.push({ text: text.slice(last, start), keyword: false, match: false });
      const hit = m[0];
      const lower = hit.toLowerCase();
      const isMatch = Boolean(trimmedQuery) && lower === trimmedQuery!.toLowerCase();
      const isKeyword = (keywords ?? []).some((k) => k.trim().toLowerCase() === lower);
      out.push({ text: hit, keyword: isKeyword, match: isMatch });
      last = start + hit.length;
    }
    if (last < text.length) out.push({ text: text.slice(last), keyword: false, match: false });
    return out;
  }, [text, keywords, query]);

  return (
    <>
      {segments.map((seg, i) => {
        if (seg.match) {
          return (
            <mark
              key={i}
              className="bg-primary/20 text-on-surface rounded-sm px-0.5 font-medium"
            >
              {seg.text}
            </mark>
          );
        }
        if (seg.keyword) {
          return (
            <span key={i} className="text-primary font-medium">
              {seg.text}
            </span>
          );
        }
        return <Fragment key={i}>{seg.text}</Fragment>;
      })}
    </>
  );
}
