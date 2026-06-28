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
import {
  useApiKeys,
  useCreateApiKey,
  useRevokeApiKey,
  useWebhooks,
  useCreateWebhook,
  useEditWebhook,
  useDeleteWebhook,
  useWebhookLogs,
  useRetryWebhook,
} from '../queries';
import type { ApiKey, Webhook, WebhookLog } from '@salesintel/types';

const keyColumnHelper = createColumnHelper<ApiKey>();
const webhookColumnHelper = createColumnHelper<Webhook>();
const logColumnHelper = createColumnHelper<WebhookLog>();

export function DeveloperScreen() {
  const t = useTranslations('developer');
  const [activeTab, setActiveTab] = useState<'keys' | 'webhooks' | 'logs'>('keys');

  // Queries
  const { data: apiKeys = [], isLoading: loadingKeys } = useApiKeys();
  const { data: webhooks = [], isLoading: loadingWebhooks } = useWebhooks();
  const { data: logs = [], isLoading: loadingLogs } = useWebhookLogs();

  // Mutations
  const createKey = useCreateApiKey();
  const revokeKey = useRevokeApiKey();
  const createWebhook = useCreateWebhook();
  const editWebhook = useEditWebhook();
  const deleteWebhook = useDeleteWebhook();
  const retryWebhook = useRetryWebhook();

  // Local UI State
  const [newKeyName, setNewKeyName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookDesc, setNewWebhookDesc] = useState('');
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>(['meeting.completed']);
  
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [isCreatingWebhook, setIsCreatingWebhook] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [revealedKeyIds, setRevealedKeyIds] = useState<Record<string, boolean>>({});
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);

  // Column definitions: API Keys
  const keyColumns = useMemo(() => [
    keyColumnHelper.accessor('name', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('keyName')}</span>,
      cell: (info) => <span className="font-semibold text-on-surface">{info.getValue()}</span>,
    }),
    keyColumnHelper.accessor('prefix', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('keyPrefix')}</span>,
      cell: (info) => <code className="bg-surface-container px-sm py-0.5 rounded text-xs font-mono">{info.getValue()}</code>,
    }),
    keyColumnHelper.accessor('secretValue', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('secret')}</span>,
      cell: (info) => {
        const id = info.row.original.id;
        const isRevealed = revealedKeyIds[id];
        return (
          <div className="flex items-center gap-sm">
            <code className="font-mono text-xs text-on-surface-variant">
              {isRevealed ? info.getValue() : '••••••••••••••••••••••••••••••••'}
            </code>
            <button
              onClick={() => setRevealedKeyIds((prev) => ({ ...prev, [id]: !prev[id] }))}
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              <Icon name={isRevealed ? 'visibility_off' : 'visibility'} size={18} />
            </button>
          </div>
        );
      },
    }),
    keyColumnHelper.accessor('status', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('status')}</span>,
      cell: (info) => {
        const isActive = info.getValue() === 'active';
        return (
          <span
            className={cn(
              'px-xs py-0.5 rounded-full text-[10px] font-bold border capitalize',
              isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-surface-container text-on-surface-variant border-outline-variant'
            )}
          >
            {isActive ? t('active') : t('revoked')}
          </span>
        );
      },
    }),
    keyColumnHelper.display({
      id: 'actions',
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('actions')}</span>,
      cell: (info) => {
        const key = info.row.original;
        if (key.status === 'revoked') return null;
        return (
          <Button
            variant="secondary"
            onClick={() => revokeKey.mutate(key.id)}
            className="rounded-xl px-sm py-1 text-label-sm border-error/20 text-error hover:bg-error-container/10"
          >
            {t('revoke')}
          </Button>
        );
      },
    }),
  ], [revealedKeyIds, t]);

  // Column definitions: Webhooks
  const webhookColumns = useMemo(() => [
    webhookColumnHelper.accessor('url', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('webhookUrl')}</span>,
      cell: (info) => <span className="font-semibold text-on-surface truncate max-w-[200px] inline-block">{info.getValue()}</span>,
    }),
    webhookColumnHelper.accessor('description', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">Description</span>,
      cell: (info) => <span className="text-on-surface-variant text-body-sm line-clamp-1">{info.getValue()}</span>,
    }),
    webhookColumnHelper.accessor('events', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('events')}</span>,
      cell: (info) => (
        <div className="flex gap-xs flex-wrap">
          {info.getValue().map((e) => (
            <code key={e} className="bg-surface-container px-xs py-0.5 rounded text-[10px] font-mono text-primary font-bold">
              {e}
            </code>
          ))}
        </div>
      ),
    }),
    webhookColumnHelper.accessor('status', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('status')}</span>,
      cell: (info) => {
        const isActive = info.getValue() === 'active';
        return (
          <span
            className={cn(
              'px-xs py-0.5 rounded-full text-[10px] font-bold border capitalize',
              isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-surface-container text-on-surface-variant border-outline-variant'
            )}
          >
            {isActive ? t('active') : 'Inactive'}
          </span>
        );
      },
    }),
    webhookColumnHelper.display({
      id: 'actions',
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('actions')}</span>,
      cell: (info) => {
        const wh = info.row.original;
        return (
          <div className="flex gap-xs">
            <button
              onClick={() => setEditingWebhook(wh)}
              className="text-on-surface-variant hover:text-primary transition-colors p-xs"
            >
              <Icon name="edit" size={18} />
            </button>
            <button
              onClick={() => deleteWebhook.mutate(wh.id)}
              className="text-on-surface-variant hover:text-error transition-colors p-xs"
            >
              <Icon name="delete" size={18} />
            </button>
          </div>
        );
      },
    }),
  ], [t]);

  // Column definitions: Logs
  const logColumns = useMemo(() => [
    logColumnHelper.accessor('event', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('logs.event')}</span>,
      cell: (info) => <code className="font-mono text-xs text-primary font-semibold">{info.getValue()}</code>,
    }),
    logColumnHelper.accessor('statusCode', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('logs.code')}</span>,
      cell: (info) => {
        const code = info.getValue();
        const isOk = code >= 200 && code < 300;
        return (
          <span className={cn('font-mono font-bold text-xs', isOk ? 'text-green-600' : 'text-error')}>
            {code}
          </span>
        );
      },
    }),
    logColumnHelper.accessor('durationMs', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('logs.duration')}</span>,
      cell: (info) => <span className="text-on-surface-variant font-mono text-xs">{info.getValue()} ms</span>,
    }),
    logColumnHelper.accessor('timestamp', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">Timestamp</span>,
      cell: (info) => <span className="text-on-surface-variant text-body-sm">{new Date(info.getValue()).toLocaleString()}</span>,
    }),
    logColumnHelper.display({
      id: 'inspect',
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">Details</span>,
      cell: (info) => (
        <button
          onClick={() => setSelectedLog(info.row.original)}
          className="text-primary hover:underline text-xs font-semibold"
        >
          View Payload
        </button>
      ),
    }),
  ], [t]);

  // Tables instances
  const keysTable = useReactTable({
    data: apiKeys,
    columns: keyColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const webhooksTable = useReactTable({
    data: webhooks,
    columns: webhookColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const logsTable = useReactTable({
    data: logs,
    columns: logColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Event toggle for webhooks form
  const handleEventToggle = (ev: string) => {
    if (newWebhookEvents.includes(ev)) {
      setNewWebhookEvents(newWebhookEvents.filter((item) => item !== ev));
    } else {
      setNewWebhookEvents([...newWebhookEvents, ev]);
    }
  };

  const handleCreateKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    createKey.mutate(newKeyName, {
      onSuccess: () => {
        setNewKeyName('');
        setIsCreatingKey(false);
      },
    });
  };

  const handleCreateWebhookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookUrl.trim()) return;
    createWebhook.mutate(
      { url: newWebhookUrl, description: newWebhookDesc, events: newWebhookEvents },
      {
        onSuccess: () => {
          setNewWebhookUrl('');
          setNewWebhookDesc('');
          setIsCreatingWebhook(false);
        },
      }
    );
  };

  return (
    <div className="space-y-lg px-sm sm:px-md max-w-7xl mx-auto pb-xl">
      {/* Header Banner */}
      <div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-base font-bold">
          {t('pageTitle')}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          {t('subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-outline-variant/60">
        <nav className="flex gap-md" aria-label="Developer tabs">
          {(['keys', 'webhooks', 'logs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'border-b-2 pb-sm py-xs font-label-md text-label-md transition-all outline-none capitalize',
                activeTab === tab
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              )}
            >
              {tab === 'keys' ? t('apiKeys') : tab === 'webhooks' ? t('webhooks') : t('deliveryLogs')}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="glass-card rounded-2xl p-lg border border-outline-variant/60 bg-surface-container-lowest">
        
        {/* Tab 1: API Keys */}
        {activeTab === 'keys' && (
          <div className="space-y-md">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-title-md text-title-md text-on-surface font-bold">Active API Credentials</h3>
              <Button variant="primary" onClick={() => setIsCreatingKey(true)} className="rounded-xl flex items-center gap-xs">
                <Icon name="add_circle" size={18} />
                {t('createKey')}
              </Button>
            </div>

            {isCreatingKey && (
              <form onSubmit={handleCreateKeySubmit} className="p-md border border-dashed border-outline-variant rounded-xl bg-surface-container-low/30 flex gap-md max-w-xl items-end">
                <div className="flex-grow">
                  <label className="block text-label-sm text-on-surface-variant mb-xs">Key Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Analytics Cron Sync"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-sm">
                  <Button type="button" variant="secondary" onClick={() => setIsCreatingKey(false)} className="rounded-xl">Cancel</Button>
                  <Button type="submit" variant="primary" className="rounded-xl">Save</Button>
                </div>
              </form>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-start">
                <thead>
                  {keysTable.getHeaderGroups().map((headerGroup) => (
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
                  {keysTable.getRowModel().rows.map((row) => (
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
        )}

        {/* Tab 2: Webhooks */}
        {activeTab === 'webhooks' && (
          <div className="space-y-md">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-title-md text-title-md text-on-surface font-bold">Active Subscriptions</h3>
              <Button variant="primary" onClick={() => setIsCreatingWebhook(true)} className="rounded-xl flex items-center gap-xs">
                <Icon name="add_circle" size={18} />
                {t('newWebhook')}
              </Button>
            </div>

            {isCreatingWebhook && (
              <form onSubmit={handleCreateWebhookSubmit} className="p-md border border-dashed border-outline-variant rounded-xl bg-surface-container-low/30 space-y-md max-w-xl">
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-xs">Webhook Endpoint URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://api.company.com/v1/webhook"
                    value={newWebhookUrl}
                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                    className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-xs">Description</label>
                  <input
                    type="text"
                    placeholder="Briefly explain what this webhook listener does"
                    value={newWebhookDesc}
                    onChange={(e) => setNewWebhookDesc(e.target.value)}
                    className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-xs">Select Events to Capture</label>
                  <div className="flex flex-wrap gap-md mt-xs">
                    {['meeting.completed', 'risk.detected', 'objection.handled', 'stage.changed'].map((ev) => (
                      <label key={ev} className="flex items-center gap-xs text-body-sm cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={newWebhookEvents.includes(ev)}
                          onChange={() => handleEventToggle(ev)}
                          className="rounded text-primary focus:ring-primary border-outline-variant"
                        />
                        <span>{ev}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-sm justify-end">
                  <Button type="button" variant="secondary" onClick={() => setIsCreatingWebhook(false)} className="rounded-xl">Cancel</Button>
                  <Button type="submit" variant="primary" className="rounded-xl">Register</Button>
                </div>
              </form>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-start">
                <thead>
                  {webhooksTable.getHeaderGroups().map((headerGroup) => (
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
                  {webhooksTable.getRowModel().rows.map((row) => (
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
        )}

        {/* Tab 3: Logs */}
        {activeTab === 'logs' && (
          <div className="space-y-md">
            <h3 className="font-title-md text-title-md text-on-surface font-bold mb-md">Delivery Event History Logs</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-start">
                <thead>
                  {logsTable.getHeaderGroups().map((headerGroup) => (
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
                  {logsTable.getRowModel().rows.map((row) => (
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
        )}
      </div>

      {/* Log Inspector Overlay Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-md z-50 animate-fade-in">
          <div className="bg-surface rounded-2xl max-w-2xl w-full p-lg space-y-md border border-outline-variant shadow-xl">
            <div className="flex justify-between items-center border-b border-outline-variant pb-md">
              <h4 className="font-headline-md text-headline-md font-bold text-on-surface">
                Inspect Webhook Delivery Log
              </h4>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-on-surface-variant hover:text-primary transition-colors p-xs"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-md text-body-sm">
              <div>
                <span className="font-semibold text-on-surface-variant">Trigger Event:</span>
                <code className="block mt-xs bg-surface-container p-sm rounded font-mono text-xs">{selectedLog.event}</code>
              </div>
              <div>
                <span className="font-semibold text-on-surface-variant">HTTP Code:</span>
                <span className="block mt-xs font-bold text-error">{selectedLog.statusCode}</span>
              </div>
            </div>

            <div>
              <span className="font-semibold text-on-surface-variant text-body-sm">Request Payload JSON</span>
              <pre className="mt-xs bg-surface-container-low text-[11px] font-mono p-md rounded border border-outline-variant/40 overflow-x-auto max-h-40">
                {selectedLog.payload}
              </pre>
            </div>

            <div>
              <span className="font-semibold text-on-surface-variant text-body-sm">Server Response Body</span>
              <pre className="mt-xs bg-surface-container-low text-[11px] font-mono p-md rounded border border-outline-variant/40 overflow-x-auto max-h-30">
                {selectedLog.responseBody}
              </pre>
            </div>

            <div className="flex gap-sm justify-end border-t border-outline-variant pt-md">
              <Button
                variant="secondary"
                onClick={() => {
                  retryWebhook.mutate(selectedLog.id, {
                    onSuccess: (updatedLog) => {
                      setSelectedLog(updatedLog);
                    },
                  });
                }}
                className="rounded-xl flex items-center gap-xs"
              >
                <Icon name="refresh" size={18} />
                {t('logs.retry')}
              </Button>
              <Button variant="primary" onClick={() => setSelectedLog(null)} className="rounded-xl">
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
