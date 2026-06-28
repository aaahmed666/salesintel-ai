'use client';

import { useTranslations } from 'next-intl';
import { Card, Input } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import { useMeetingDirectory } from '../hooks';
import { useMeetingAnalyses } from '../queries';
import { DirectoryPagination } from './directory-pagination';
import { DirectoryStats } from './directory-stats';
import { DirectoryToolbar } from './directory-toolbar';
import { MeetingsTable } from './meetings-table';

/**
 * The Meetings Analysis Directory screen: KPI cards, a searchable/filterable/
 * sortable, paginated table of analyzed meetings backed by React Query +
 * TanStack Table. All query state is server-driven via {@link useMeetingDirectory}.
 */
export function MeetingsDirectoryScreen() {
  const t = useTranslations('meetings.directory');
  const directory = useMeetingDirectory();
  const { data, isLoading, isError, isFetching, refetch } = useMeetingAnalyses(directory.params);

  const rows = data?.items ?? [];

  return (
    <div className="gap-lg p-md lg:p-lg mx-auto flex w-full max-w-[88rem] flex-col">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-headline-lg text-on-surface">{t('pageTitle')}</h1>
        <p className="text-body-md text-on-surface-variant">{t('pageSubtitle')}</p>
      </header>

      <DirectoryStats />

      <Card className="gap-md flex flex-col p-0">
        <div className="gap-md border-outline-variant p-lg flex flex-col border-b">
          <DirectoryToolbar status={directory.status} onStatusChange={directory.changeStatus} />
          <Input
            value={directory.searchInput}
            onChange={(e) => directory.setSearchInput(e.target.value)}
            placeholder={t('searchPlaceholder')}
            startIcon={<Icon name="search" size={18} className="text-on-surface-variant" />}
            className="h-11 max-w-md"
            aria-label={t('searchPlaceholder')}
          />
        </div>

        <div className={isFetching && !isLoading ? 'opacity-70 transition-opacity' : undefined}>
          <MeetingsTable
            rows={rows}
            isLoading={isLoading}
            isError={isError}
            sortBy={directory.sortBy}
            sortDir={directory.sortDir}
            onSort={directory.toggleSort}
            onRetry={() => refetch()}
            pageSize={directory.pageSize}
          />
        </div>

        {!isLoading && !isError && rows.length > 0 ? (
          <div className="border-outline-variant p-lg border-t">
            <DirectoryPagination
              page={data?.page ?? 1}
              pageSize={directory.pageSize}
              total={data?.total ?? 0}
              totalPages={data?.totalPages ?? 1}
              onPageChange={directory.setPage}
            />
          </div>
        ) : null}
      </Card>
    </div>
  );
}
