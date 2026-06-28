'use client';

import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { Skeleton } from '@salesintel/ui';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@salesintel/config';
import { Icon } from '@/features/shell';
import { StageBadge } from './stage-badge';
import { TemperatureBadge } from './temperature-badge';
import type { Deal } from '@salesintel/types';


const columnHelper = createColumnHelper<Deal>();

interface PipelineTableProps {
  deals: Deal[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  globalFilter: string;
}

function formatCurrency(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(dateStr));
}

/**
 * TanStack Table for deals with sortable columns, following the meetings-table pattern.
 * Client-side sorting since deals come pre-filtered from the hook.
 */
export function PipelineTable({
  deals,
  isLoading,
  isError,
  onRetry,
  globalFilter,
}: PipelineTableProps) {
  const t = useTranslations('pipeline');
  const tCol = useTranslations('pipeline.columns');
  const locale = useLocale();

  const columns = useMemo(
    () => [
      columnHelper.accessor('company', {
        header: () => (
          <span className="text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">
            {tCol('company')}
          </span>
        ),
        cell: (info) => {
          const row = info.row.original;
          return (
            <Link href={ROUTES.pipelines.detail(row.id)} className="block max-w-[14rem] group hover:underline">
              <span className="block font-semibold text-on-surface group-hover:text-primary transition-colors">{row.company}</span>
              <span className="text-body-sm block text-on-surface-variant">{row.title}</span>
            </Link>
          );
        },

      }),
      columnHelper.accessor('value', {
        header: () => (
          <span className="text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">
            {tCol('value')}
          </span>
        ),
        cell: (info) => (
          <span className="text-body-sm font-semibold text-on-surface tabular-nums">
            {formatCurrency(info.getValue(), locale)}
          </span>
        ),
      }),
      columnHelper.accessor('stage', {
        header: () => (
          <span className="text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">
            {tCol('stage')}
          </span>
        ),
        cell: (info) => <StageBadge stage={info.getValue()} size="sm" />,
      }),
      columnHelper.accessor('temperature', {
        header: () => (
          <span className="text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">
            {tCol('temperature')}
          </span>
        ),
        cell: (info) => <TemperatureBadge temperature={info.getValue()} />,
      }),
      columnHelper.accessor('closeDate', {
        header: () => (
          <span className="text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">
            {tCol('closeDate')}
          </span>
        ),
        cell: (info) => (
          <span className="text-body-sm text-on-surface-variant">{formatDate(info.getValue(), locale)}</span>
        ),
      }),
      columnHelper.accessor((row) => row.rep.name, {
        id: 'rep',
        header: () => (
          <span className="text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">
            {tCol('rep')}
          </span>
        ),
        cell: (info) => {
          const rep = info.row.original.rep;
          return (
            <div className="flex items-center gap-2">
              {rep.avatarUrl ? (
                <img className="h-6 w-6 rounded-full" src={rep.avatarUrl} alt={rep.name} />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-white">
                  {rep.initials}
                </div>
              )}
              <span className="text-body-sm text-on-surface">{rep.name}</span>
            </div>
          );
        },
      }),
      columnHelper.accessor('probability', {
        header: () => (
          <span className="text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">
            {tCol('probability')}
          </span>
        ),
        cell: (info) => {
          const val = info.getValue();
          return (
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-container-high">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${val}%` }}
                />
              </div>
              <span className="text-body-sm text-on-surface-variant tabular-nums">{val}%</span>
            </div>
          );
        },
      }),
      columnHelper.accessor('lastActivity', {
        header: () => (
          <span className="text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">
            {tCol('lastActivity')}
          </span>
        ),
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex items-center gap-1.5">
              <Icon name={row.lastActivityIcon} size={14} className="text-on-surface-variant" />
              <span className="text-body-sm text-on-surface-variant">{info.getValue()}</span>
            </div>
          );
        },
      }),
    ],
    [locale, tCol],
  );

  const table = useReactTable({
    data: deals,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <Icon name="error" size={40} className="text-error" />
        <p className="text-body-md text-on-surface">{t('error')}</p>
        <button type="button" onClick={onRetry} className="text-body-sm font-semibold text-primary hover:underline">
          {t('retry')}
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-4 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-high">
          <Icon name="search_off" size={28} className="text-on-surface-variant" />
        </div>
        <p className="text-body-md font-medium text-on-surface">{t('empty.title')}</p>
        <p className="text-body-sm max-w-sm text-on-surface-variant">{t('empty.subtitle')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-outline-variant/60">
      <table className="w-full min-w-[72rem] border-collapse">
        <thead>
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id} className="border-b border-outline-variant bg-surface-container-low/60">
              {group.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-start align-middle cursor-pointer select-none"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-1">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() && (
                      <Icon
                        name={header.column.getIsSorted() === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        size={14}
                        className="text-primary"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-outline-variant">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-surface-container-low/40">
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
