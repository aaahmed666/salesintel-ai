'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  useAIProviders,
  useUpdateProviderModel,
  useToggleProviderEnabled,
  useSystemHealth,
} from '../queries';
import type { AIProviderId } from '@salesintel/types';

export function AISettingsScreen() {
  const t = useTranslations('aiSettings');

  // Queries
  const { data: providers = [], isLoading: loadingProviders } = useAIProviders();
  const { data: health, isLoading: loadingHealth } = useSystemHealth();

  // Mutations
  const updateModel = useUpdateProviderModel();
  const toggleProvider = useToggleProviderEnabled();

  const handleToggle = (id: AIProviderId, enabled: boolean) => {
    toggleProvider.mutate({ id, enabled });
  };

  const handleModelChange = (id: AIProviderId, model: string) => {
    updateModel.mutate({ id, model });
  };

  const isLoading = loadingProviders || loadingHealth;

  if (isLoading || !health) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-md">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="font-label-md text-label-md text-on-surface-variant">Loading AI Infrastructure Settings...</p>
      </div>
    );
  }

  const statusColors = {
    healthy: 'text-green-500 bg-green-500/10 border-green-500/20',
    degraded: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    offline: 'text-error bg-error/10 border-error/20',
  };

  return (
    <div className="space-y-lg px-sm sm:px-md max-w-7xl mx-auto pb-xl">
      {/* Header Banner */}
      <div className="mb-xl flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-base font-bold">
            {t('pageTitle')}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            {t('subtitle')}
          </p>
        </div>

        {/* Global Uptime Metric Badge */}
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-md flex items-center gap-md">
          <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center text-green-600">
            <Icon name="check_circle" size={24} />
          </div>
          <div>
            <span className="font-bold text-[11px] uppercase tracking-wider text-on-surface-variant block">
              {t('uptime')}
            </span>
            <span className="font-headline-md text-headline-md font-black text-on-surface">
              {health.uptimePercent}%
            </span>
          </div>
        </div>
      </div>

      <FeatureOrchestration />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        
        {/* Left Side: Providers and Chart */}
        <div className="lg:col-span-8 space-y-lg">
          {/* Provider Cards */}
          <div className="space-y-md">
            <h3 className="font-title-md text-title-md text-on-surface font-bold">{t('computeEngines')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {providers.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'glass-card rounded-2xl p-lg border border-outline-variant/60 bg-surface-container-lowest flex flex-col justify-between h-48 transition-all',
                    !item.enabled && 'opacity-60 bg-surface-container/10'
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
                        <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider block mt-base">
                          {item.id}
                        </span>
                      </div>
                    </div>

                    {/* Enable Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={(e) => handleToggle(item.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {/* Settings selector */}
                  {item.enabled ? (
                    <div className="space-y-xs">
                      <label className="block text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">{t('activeModel')}</label>
                      <select
                        value={item.activeModel}
                        onChange={(e) => handleModelChange(item.id, e.target.value)}
                        className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary"
                      >
                        {item.availableModels.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <p className="text-body-sm text-on-surface-variant italic">Engine disabled in settings</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Usage Recharts Graph */}
          <div className="glass-card rounded-2xl p-lg border border-outline-variant/60 bg-surface-container-lowest">
            <h3 className="font-title-md text-title-md text-on-surface font-bold mb-md">
              {t('monthlyBillingUsage')}
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={health.usageHistory}>
                  <defs>
                    <linearGradient id="colorOpenai" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4648d4" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4648d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGemini" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8455ef" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8455ef" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="openaiTokens" stroke="#4648d4" fillOpacity={1} fill="url(#colorOpenai)" name="OpenAI Tokens" />
                  <Area type="monotone" dataKey="geminiTokens" stroke="#8455ef" fillOpacity={1} fill="url(#colorGemini)" name="Gemini Tokens" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Side: System Health Dashboard */}
        <div className="lg:col-span-4 space-y-lg">
          <div className="glass-card rounded-2xl p-lg border border-outline-variant/60 bg-surface-container-lowest space-y-lg">
            <h3 className="font-title-md text-title-md text-on-surface font-bold border-b border-outline-variant/30 pb-sm">
              {t('systemHealth')}
            </h3>

            {/* Health indicators */}
            <div className="grid grid-cols-2 gap-sm">
              <div className="p-md rounded-xl bg-surface-container-low border border-outline-variant/30 text-center">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-xs">
                  {t('queueBacklog')}
                </p>
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  {health.queueBacklog}
                </span>
                <span className="text-[10px] text-on-surface-variant block mt-xs">Pending tasks</span>
              </div>
              <div className="p-md rounded-xl bg-surface-container-low border border-outline-variant/30 text-center">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-xs">
                  {t('processingRate')}
                </p>
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  {health.processingRatePerMin}/m
                </span>
                <span className="text-[10px] text-on-surface-variant block mt-xs">Completion rate</span>
              </div>
            </div>

            {/* Component list */}
            <div className="space-y-md">
              <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                Service Components Status
              </h4>
              <div className="space-y-sm">
                {health.components.map((c) => (
                  <div key={c.name} className="flex justify-between items-center p-sm rounded-xl border border-outline-variant/30 bg-surface text-body-sm">
                    <span className="font-semibold text-on-surface">{c.name}</span>
                    <div className="flex gap-sm items-center">
                      <span className="font-mono text-xs text-on-surface-variant">{c.responseTimeMs}ms</span>
                      <span className={cn('px-xs py-0.5 rounded-full text-[9px] font-bold border capitalize shrink-0', statusColors[c.status])}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Feature-orchestration toggles (design parity with the AI settings mockup). */
function FeatureOrchestration() {
  const t = useTranslations('aiSettings');
  const [features, setFeatures] = useState({
    autoSummary: true,
    sentimentEngine: true,
    competitorTracking: false,
  });
  const rows = [
    { key: 'autoSummary' as const, icon: 'summarize' },
    { key: 'sentimentEngine' as const, icon: 'sentiment_satisfied' },
    { key: 'competitorTracking' as const, icon: 'radar' },
  ];
  const activeCount = Object.values(features).filter(Boolean).length;

  return (
    <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-lg">
      <div className="mb-md flex items-center justify-between">
        <div>
          <h3 className="font-title-md text-title-md font-bold text-on-surface">
            {t('featureOrchestration')}
          </h3>
          <p className="text-body-sm text-on-surface-variant">{t('featureOrchestrationDesc')}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-sm py-1 text-label-sm font-bold text-primary">
          {t('activeToggles', { count: activeCount })}
        </span>
      </div>
      <div className="space-y-md">
        {rows.map(({ key, icon }) => {
          const on = features[key];
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-md rounded-xl border border-outline-variant/50 bg-surface-container-low p-md"
            >
              <div className="flex items-start gap-md">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary">
                  <Icon name={icon} size={20} />
                </span>
                <div>
                  <p className="font-semibold text-on-surface">{t(`features.${key}`)}</p>
                  <p className="text-body-sm text-on-surface-variant">{t(`features.${key}Desc`)}</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-label={t(`features.${key}`)}
                onClick={() => setFeatures((f) => ({ ...f, [key]: !f[key] }))}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  on ? 'bg-primary' : 'bg-surface-container-high'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    on ? 'start-[1.375rem]' : 'start-0.5'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
