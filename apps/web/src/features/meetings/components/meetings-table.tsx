'use client';

import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ROUTES } from '@salesintel/config';
import type { MeetingAnalysis, MeetingSortField, SortDirection } from '@salesintel/types';
import { Skeleton } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import { Link } from '@/i18n/navigation';
import { formatCurrency, formatDateTime } from '../hooks';
import { InsightTags } from './insight-tags';
import { RepCell } from './rep-cell';
import { SentimentBadge } from './sentiment-badge';

const columnHelper = createColumnHelper<MeetingAnalysis>();

interface MeetingsTableProps {
  rows: MeetingAnalysis[];
  isLoading: boolean;
  isError: boolean;
  sortBy: MeetingSortField;
  sortDir: SortDirection;
  onSort: (field: MeetingSortField) => void;
  onRetry: () => void;
  pageSize: number;
}

/** A sortable header button reflecting the active sort field + direction. */
function SortHeader({
  label,
  field,
  active,
  dir,
  onSort,
  align = 'start',
}: {
  label: string;
  field: MeetingSortField;
  active: boolean;
  dir: SortDirection;
  onSort: (field: MeetingSortField) => void;
  align?: 'start' | 'end';
}) {
  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className={`text-label-sm text-on-surface-variant hover:text-on-surface group inline-flex items-center gap-1 font-semibold uppercase tracking-wide transition-colors ${
        align === 'end' ? 'flex-row-reverse' : ''
      }`}
    >
      {label}
      <Icon
        name={active ? (dir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
        size={15}
        className={
          active ? 'text-primary' : 'text-on-surface-variant/50 group-hover:text-on-surface-variant'
        }
      />
    </button>
  );
}

/**
 * The Meetings Directory table. Uses TanStack Table for headless column/row
 * modeling while sorting/paging stay server-driven (the parent hook owns query
 * state). Renders dedicated loading, error and empty treatments.
 */
export function MeetingsTable({
  rows,
  isLoading,
  isError,
  sortBy,
  sortDir,
  onSort,
  onRetry,
  pageSize,
}: MeetingsTableProps) {
  const t = useTranslations('meetings.directory');
  const tCol = useTranslations('meetings.directory.columns');
  const locale = useLocale();

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: () => (
          <SortHeader
            label={tCol('name')}
            field="title"
            active={sortBy === 'title'}
            dir={sortDir}
            onSort={onSort}
          />
        ),
        cell: (info) => {
          const row = info.row.original;
          return (
            <Link href={ROUTES.meetings.detail(row.id)} className="group block max-w-[16rem]">
              <span className="text-on-surface group-hover:text-primary block font-semibold">
                {row.title}
              </span>
              <span className="text-body-sm text-on-surface-variant block">{row.company}</span>
            </Link>
          );
        },
      }),
      columnHelper.accessor('date', {
        header: () => (
          <SortHeader
            label={tCol('date')}
            field="date"
            active={sortBy === 'date'}
            dir={sortDir}
            onSort={onSort}
          />
        ),
        cell: (info) => (
          <span className="text-body-sm text-on-surface-variant">
            {formatDateTime(info.getValue(), locale)}
          </span>
        ),
      }),
      columnHelper.accessor((row) => row.rep.name, {
        id: 'rep',
        header: () => (
          <SortHeader
            label={tCol('rep')}
            field="rep"
            active={sortBy === 'rep'}
            dir={sortDir}
            onSort={onSort}
          />
        ),
        cell: (info) => <RepCell rep={info.row.original.rep} />,
      }),
      columnHelper.accessor('dealValue', {
        header: () => (
          <SortHeader
            label={tCol('dealValue')}
            field="durationMinutes"
            active={sortBy === 'durationMinutes'}
            dir={sortDir}
            onSort={onSort}
          />
        ),
        cell: (info) => {
          const value = info.getValue();
          return (
            <span className="text-body-sm text-on-surface font-semibold">
              {value !== undefined ? formatCurrency(value, locale) : '—'}
            </span>
          );
        },
      }),
      columnHelper.accessor('sentiment', {
        header: () => (
          <SortHeader
            label={tCol('sentiment')}
            field="score"
            active={sortBy === 'score'}
            dir={sortDir}
            onSort={onSort}
          />
        ),
        cell: (info) => (
          <SentimentBadge sentiment={info.getValue()} score={info.row.original.score} />
        ),
      }),
      columnHelper.display({
        id: 'insights',
        header: () => (
          <span className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wide">
            {tCol('insights')}
          </span>
        ),
        cell: (info) => <InsightTags insights={info.row.original.insights} />,
      }),
    ],
    [locale, onSort, sortBy, sortDir, tCol],
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
  });

  if (isError) {
    return (
      <div className="py-2xl flex flex-col items-center gap-3 text-center">
        <Icon name="error" size={40} className="text-error" />
        <p className="text-body-md text-on-surface">{t('error')}</p>
        <button
          type="button"
          onClick={onRetry}
          className="text-body-sm text-primary font-semibold hover:underline"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-md space-y-3">
        {Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="py-2xl flex flex-col items-center gap-3 text-center">
        <div className="bg-surface-container-high flex h-14 w-14 items-center justify-center rounded-full">
          <Icon name="search_off" size={28} className="text-on-surface-variant" />
        </div>
        <p className="text-body-md text-on-surface font-medium">{t('empty.title')}</p>
        <p className="text-body-sm text-on-surface-variant max-w-sm">{t('empty.subtitle')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[64rem] border-collapse">
        <thead>
          {table.getHeaderGroups().map((group) => (
            <tr
              key={group.id}
              className="border-outline-variant bg-surface-container-low/60 border-y"
            >
              {group.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 text-start align-middle">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-outline-variant divide-y">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-surface-container-low/40 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-4 align-middle">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
