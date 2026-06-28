'use client';

import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_DIRECTORY_PAGE_SIZE } from '@salesintel/config';
import type {
  MeetingListParams,
  MeetingSortField,
  MeetingStatus,
  SortDirection,
} from '@salesintel/types';

/**
 * Owns all directory query state and debounces the free-text search so we don't
 * refetch on every keystroke. Returns the assembled {@link MeetingListParams}
 * plus setters the toolbar/table bind to.
 */
export function useMeetingDirectory() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<MeetingStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<MeetingSortField>('date');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_DIRECTORY_PAGE_SIZE);

  // Debounce the search box (300ms) and reset to page 1 on a new term.
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  function toggleSort(field: MeetingSortField) {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
    setPage(1);
  }

  function changeStatus(next: MeetingStatus | 'all') {
    setStatus(next);
    setPage(1);
  }

  function changePageSize(next: number) {
    setPageSize(next);
    setPage(1);
  }

  const params = useMemo<MeetingListParams>(
    () => ({ search, status, sortBy, sortDir, page, pageSize }),
    [search, status, sortBy, sortDir, page, pageSize],
  );

  return {
    params,
    searchInput,
    setSearchInput,
    status,
    changeStatus,
    sortBy,
    sortDir,
    toggleSort,
    page,
    setPage,
    pageSize,
    changePageSize,
  };
}
