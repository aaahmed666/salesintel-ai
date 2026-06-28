'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button, cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';
import { useSecurityEvents } from '../queries';
import type { SecurityEvent, AuditSeverity } from '@salesintel/types';

const columnHelper = createColumnHelper<SecurityEvent>();

export function AuditLogsScreen() {
  const t = useTranslations('auditLogs');

  const { data: events = [], isLoading, isError } = useSecurityEvents();

  // Local state
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [userFilter, setUserFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  // Filters logic
  const filteredEvents = useMemo(() => {
    let result = [...events];
    if (userFilter !== 'all') {
      result = result.filter((e) => e.user === userFilter);
    }
    if (severityFilter !== 'all') {
      result = result.filter((e) => e.severity === severityFilter);
    }
    return result;
  }, [events, userFilter, severityFilter]);

  const columns = useMemo(() => [
    columnHelper.accessor('timestamp', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('time')}</span>,
      cell: (info) => <span className="text-on-surface-variant text-body-sm">{new Date(info.getValue()).toLocaleString()}</span>,
    }),
    columnHelper.accessor('eventType', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('event')}</span>,
      cell: (info) => <code className="font-mono text-xs text-primary font-bold">{info.getValue()}</code>,
    }),
    columnHelper.accessor('user', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('user')}</span>,
      cell: (info) => <span className="font-semibold text-on-surface">{info.getValue()}</span>,
    }),
    columnHelper.accessor('severity', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('severity')}</span>,
      cell: (info) => {
        const val = info.getValue();
        const color = val === 'info' ? 'bg-surface-container text-on-surface-variant border-outline-variant' : val === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-error-container/10 text-error border-error/25';
        return (
          <span className={cn('px-xs py-0.5 rounded-full text-[10px] font-bold border capitalize', color)}>
            {val}
          </span>
        );
      },
    }),
    columnHelper.accessor('ipAddress', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('ip')}</span>,
      cell: (info) => <span className="text-on-surface-variant text-body-sm font-mono">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: 'inspect',
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">Inspect</span>,
      cell: (info) => (
        <button
          onClick={() => setSelectedEvent(info.row.original)}
          className="text-primary hover:underline text-xs font-semibold"
        >
          View details
        </button>
      ),
    }),
  ], [t]);

  const table = useReactTable({
    data: filteredEvents,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Client side CSV exporter
  const handleExportCSV = () => {
    if (filteredEvents.length === 0) return;
    const headers = ['Timestamp', 'Event Type', 'Initiator', 'Severity', 'IP Address', 'Details'];
    const rows = filteredEvents.map((e) => [
      e.timestamp,
      e.eventType,
      e.user,
      e.severity,
      e.ipAddress,
      e.details.replace(/"/g, '""'),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => `"${r.join('","')}"`)].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `security_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportMock = (format: 'Excel' | 'PDF') => {
    alert(`Exporting ${filteredEvents.length} records in ${format} format. Your download will begin shortly.`);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-md">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="font-label-md text-label-md text-on-surface-variant">Loading Security Audit Logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-lg px-sm sm:px-md max-w-7xl mx-auto pb-xl">
      {/* Header Banner */}
      <div className="flex justify-between items-center mb-xl flex-wrap gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-base font-bold">
            {t('pageTitle')}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            {t('subtitle')}
          </p>
        </div>

        {/* Exporters Button */}
        <div className="flex gap-xs flex-wrap">
          <Button variant="secondary" onClick={handleExportCSV} className="rounded-xl flex items-center gap-xs">
            <Icon name="download" size={18} />
            CSV
          </Button>
          <Button variant="secondary" onClick={() => handleExportMock('Excel')} className="rounded-xl flex items-center gap-xs">
            <Icon name="table_chart" size={18} />
            Excel
          </Button>
          <Button variant="secondary" onClick={() => handleExportMock('PDF')} className="rounded-xl flex items-center gap-xs">
            <Icon name="picture_as_pdf" size={18} />
            PDF
          </Button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-md items-start sm:items-center bg-surface-container p-md rounded-2xl border border-outline-variant/40">
        <div className="flex gap-md flex-wrap items-center">
          <div className="flex items-center gap-xs">
            <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-surface-container-lowest text-body-sm rounded-xl border border-outline-variant px-sm py-1.5 outline-none focus:ring-1 focus:ring-primary capitalize"
            >
              <option value="all">All Grades</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="flex items-center gap-xs">
            <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">Initiator:</span>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="bg-surface-container-lowest text-body-sm rounded-xl border border-outline-variant px-sm py-1.5 outline-none focus:ring-1 focus:ring-primary capitalize"
            >
              <option value="all">All members</option>
              <option value="John Doe">John Doe</option>
              <option value="Jane Smith">Jane Smith</option>
              <option value="System Worker">System Worker</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Table View */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-lg border border-outline-variant/60 bg-surface-container-lowest overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-start">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-outline-variant text-on-surface-variant bg-surface-container-low">
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="p-md text-start font-semibold text-xs uppercase tracking-wider">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-outline-variant/60 hover:bg-surface-container-low/20 transition-all">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-md text-body-sm text-on-surface-variant font-medium">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Timeline Panel (Right) */}
        <div className="lg:col-span-4">
          {selectedEvent ? (
            <div className="glass-card rounded-2xl p-lg border border-outline-variant/60 bg-surface-container-lowest space-y-lg relative">
              <div className="flex justify-between items-start border-b border-outline-variant pb-sm">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  {t('details')}
                </h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-on-surface-variant hover:text-primary transition-colors p-xs"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>

              <div className="space-y-md text-body-sm">
                <div>
                  <span className="font-bold text-[10px] uppercase text-on-surface-variant tracking-wider block mb-base">{t('event')}</span>
                  <span className="font-mono text-primary font-bold">{selectedEvent.eventType}</span>
                </div>
                <div>
                  <span className="font-bold text-[10px] uppercase text-on-surface-variant tracking-wider block mb-base">{t('user')}</span>
                  <span className="text-on-surface font-semibold">{selectedEvent.user}</span>
                </div>
                <div>
                  <span className="font-bold text-[10px] uppercase text-on-surface-variant tracking-wider block mb-base">{t('ip')}</span>
                  <span className="text-on-surface font-mono">{selectedEvent.ipAddress}</span>
                </div>
                <div>
                  <span className="font-bold text-[10px] uppercase text-on-surface-variant tracking-wider block mb-base">{t('time')}</span>
                  <span className="text-on-surface-variant">{new Date(selectedEvent.timestamp).toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-bold text-[10px] uppercase text-on-surface-variant tracking-wider block mb-base">Details payload message</span>
                  <p className="text-on-surface bg-surface p-md rounded-xl border border-outline-variant/30 leading-relaxed font-mono text-xs">
                    {selectedEvent.details}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-lg flex flex-col items-center justify-center text-center py-20 text-on-surface-variant border border-outline-variant/60 h-full min-h-[250px]">
              <Icon name="receipt_long" size={36} className="text-outline-variant mb-md" />
              <p className="font-label-md text-label-md font-bold">No Event Selected</p>
              <p className="text-body-sm text-on-surface-variant max-w-[15rem] mt-xs">
                Select an entry on the list to inspect trace IP address records and descriptions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
