'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import {
  useIntegrations,
  useConnectIntegration,
  useDisconnectIntegration,
  useUpdateIntegrationSettings,
} from '../queries';
import type { Integration, IntegrationId } from '@salesintel/types';

export function IntegrationsScreen() {
  const t = useTranslations('integrations');
  const { data: integrations = [], isLoading, isError } = useIntegrations();
  
  const connectMutation = useConnectIntegration();
  const disconnectMutation = useDisconnectIntegration();
  const updateSettingsMutation = useUpdateIntegrationSettings();

  const [selectedId, setSelectedId] = useState<IntegrationId | null>(null);
  const [syncFreq, setSyncFreq] = useState<number>(30);

  const selectedIntegration = integrations.find((i) => i.id === selectedId);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-md">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="font-label-md text-label-md text-on-surface-variant">Loading Integrations...</p>
      </div>
    );
  }

  const handleToggleConnect = (item: Integration) => {
    if (item.status === 'connected') {
      disconnectMutation.mutate(item.id);
    } else {
      connectMutation.mutate(item.id);
    }
  };

  const handleSaveSettings = () => {
    if (!selectedId) return;
    updateSettingsMutation.mutate({
      id: selectedId,
      settings: { syncFrequencyMinutes: syncFreq },
    });
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'degraded':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-error bg-error/10 border-error/20';
    }
  };

  return (
    <div className="space-y-lg px-sm sm:px-md max-w-7xl mx-auto pb-xl">
      {/* Header Banner */}
      <div className="mb-xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-base font-bold">
          {t('pageTitle')}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Integrations Grid (Left) */}
        <div className="lg:col-span-8 space-y-md">
          <h3 className="font-title-md text-title-md text-on-surface font-bold">
            {t('activeConnections')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {integrations.map((item) => {
              const isSelected = item.id === selectedId;
              const isConnected = item.status === 'connected';
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedId(item.id);
                    setSyncFreq(item.settings.syncFrequencyMinutes || 30);
                  }}
                  className={cn(
                    'glass-card rounded-2xl p-lg border cursor-pointer transition-all hover:shadow-md flex flex-col justify-between h-48',
                    isSelected
                      ? 'border-primary ring-2 ring-primary/20 bg-primary-container/5'
                      : 'border-outline-variant/60 hover:border-primary/40'
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-md items-center">
                      <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary border border-outline-variant/40">
                        <Icon name={item.icon} size={24} />
                      </div>
                      <div>
                        <h4 className="font-label-md text-label-md font-bold text-on-surface">
                          {item.name}
                        </h4>
                        <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <span
                      className={cn(
                        'px-xs py-0.5 rounded-full text-[10px] font-bold border capitalize shrink-0',
                        isConnected
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-surface-container text-on-surface-variant border-outline-variant'
                      )}
                    >
                      {isConnected ? t('connected') : t('disconnected')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    {isConnected ? (
                      <div className="flex items-center gap-xs">
                        <span className={cn('w-2 h-2 rounded-full animate-pulse', isConnected ? 'bg-green-500' : 'bg-outline-variant')} />
                        <span className="text-[11px] text-on-surface-variant">
                          Uptime: <strong className="capitalize">{item.healthStatus}</strong>
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-on-surface-variant">Ready to integrate</span>
                    )}

                    <Button
                      variant={isConnected ? 'secondary' : 'primary'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleConnect(item);
                      }}
                      className="rounded-xl px-md py-1.5 text-label-sm shrink-0"
                    >
                      {isConnected ? t('disconnect') : t('connect')}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Integration Details & settings (Right Panel) */}
        <div className="lg:col-span-4">
          {selectedIntegration ? (
            <div className="glass-card rounded-2xl p-lg border border-outline-variant/60 space-y-lg">
              {/* Detail Title */}
              <div className="border-b border-outline-variant/30 pb-md">
                <div className="flex gap-md items-center mb-sm">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <Icon name={selectedIntegration.icon} size={20} />
                  </div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                    {selectedIntegration.name}
                  </h3>
                </div>
                <p className="text-body-sm text-on-surface-variant">
                  Configure real-time hooks, data schema filters, and view execution tracking logs.
                </p>
              </div>

              {/* Health and Status */}
              <div className="grid grid-cols-2 gap-sm">
                <div className="p-md rounded-xl bg-surface-container-low border border-outline-variant/30 text-center">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-xs">
                    {t('healthStatus')}
                  </p>
                  <span className={cn('px-sm py-0.5 rounded-full text-xs font-semibold capitalize', getHealthColor(selectedIntegration.healthStatus))}>
                    {selectedIntegration.healthStatus}
                  </span>
                </div>
                <div className="p-md rounded-xl bg-surface-container-low border border-outline-variant/30 text-center">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-xs">
                    Last Synced
                  </p>
                  <span className="text-body-sm text-on-surface font-semibold">
                    {selectedIntegration.lastSyncedAt
                      ? new Date(selectedIntegration.lastSyncedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                      : 'Never'}
                  </span>
                </div>
              </div>

              {/* Sync settings */}
              {selectedIntegration.status === 'connected' && (
                <div className="space-y-md">
                  <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                    {t('settingsTitle')}
                  </h4>
                  <div className="space-y-xs">
                    <label className="block text-label-sm text-on-surface-variant">Sync Frequency (Minutes)</label>
                    <div className="flex gap-sm">
                      <input
                        type="number"
                        min={5}
                        max={1440}
                        value={syncFreq}
                        onChange={(e) => setSyncFreq(parseInt(e.target.value) || 30)}
                        className="bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm w-full outline-none focus:ring-1 focus:ring-primary"
                      />
                      <Button variant="primary" onClick={handleSaveSettings} className="rounded-xl">
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sync History Logs */}
              <div className="space-y-md">
                <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                  {t('syncHistory')}
                </h4>
                <div className="space-y-sm max-h-[14rem] overflow-y-auto pr-xs">
                  {selectedIntegration.history.length === 0 ? (
                    <p className="text-body-sm text-on-surface-variant text-center py-lg">
                      {t('history.noHistory')}
                    </p>
                  ) : (
                    selectedIntegration.history.map((log) => {
                      const isSuccess = log.status === 'success';
                      return (
                        <div
                          key={log.id}
                          className={cn(
                            'p-sm rounded-xl border border-outline-variant/30 bg-surface flex flex-col gap-base text-body-sm',
                            !isSuccess && 'border-error/20 bg-error-container/5'
                          )}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-on-surface">
                              {new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className={cn('text-[10px] font-bold uppercase', isSuccess ? 'text-green-600' : 'text-error')}>
                              {log.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-[11px] text-on-surface-variant">
                            <span>Records: {log.recordCount}</span>
                            {log.errorMessage && <span className="text-error font-medium">{log.errorMessage}</span>}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-lg flex flex-col items-center justify-center text-center py-20 text-on-surface-variant border border-outline-variant/60 h-full min-h-[300px]">
              <Icon name="extension" size={36} className="text-outline-variant mb-md" />
              <p className="font-label-md text-label-md font-bold">Select Integration Service</p>
              <p className="text-body-sm text-on-surface-variant max-w-[15rem] mt-xs">
                Pick any pipeline connection on the left side to configure preferences and inspect status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
