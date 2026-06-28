'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import {
  useRisks,
  useRiskRules,
  useUpdateRiskStatus,
  useToggleRiskRule,
  useCreateRiskRule,
} from '../queries';

import { RiskKpiRadial } from './risk-kpi-radial';
import { RiskRootCauses } from './risk-root-causes';
import { RiskRulesPanel } from './risk-rules-panel';
import { RiskQueue } from './risk-queue';
import { RiskDetailPanel } from './risk-detail-panel';
import type { DealRisk } from '@salesintel/types';

export function RiskDashboardScreen() {
  const t = useTranslations('risks');
  const [selectedRisk, setSelectedRisk] = useState<DealRisk | null>(null);

  const { data: risks = [], isLoading, isError, refetch } = useRisks();
  const { data: rules = [] } = useRiskRules();

  const updateStatus = useUpdateRiskStatus();
  const toggleRule = useToggleRiskRule();
  const createRule = useCreateRiskRule();

  // Aggregate stats
  const criticalCount = risks.filter((r) => r.severity === 'critical' && r.status !== 'resolved').length;
  const highCount = risks.filter((r) => r.severity === 'high' && r.status !== 'resolved').length;
  const normalCount = risks.filter((r) => ['medium', 'low'].includes(r.severity) && r.status !== 'resolved').length;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-md">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="font-label-md text-label-md text-on-surface-variant">
          {t('loading')}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-md text-center">
        <Icon name="error" className="text-error" size={48} />
        <h3 className="font-headline-md text-headline-md font-bold text-on-background">
          {t('error')}
        </h3>
        <Button variant="primary" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-lg px-sm sm:px-md max-w-7xl mx-auto pb-xl">
      {/* Page Header Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-xl">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-base font-bold">
            {t('pageTitle')}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex gap-md shrink-0">
          <div className="flex items-center bg-error-container/20 text-error border border-error/20 px-md py-sm rounded-full gap-xs font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error"></span>
            </span>
            <span className="font-label-sm text-label-sm">
              {t('criticalCount', { count: criticalCount })}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-lg lg:grid-cols-12">
        {/* Left main area (8 cols or 12 depending on panel selection) */}
        <div className={`space-y-lg transition-all duration-300 ${selectedRisk ? 'lg:col-span-8' : 'lg:col-span-8'}`}>
          <RiskQueue
            risks={risks}
            selectedId={selectedRisk?.id}
            onSelectRisk={(r) => setSelectedRisk(r)}
          />

          <RiskRulesPanel
            rules={rules}
            onToggleRule={(id, enabled) => toggleRule.mutate({ id, enabled })}
            onCreateRule={(r) => createRule.mutate({ ...r, enabled: true })}
          />
        </div>

        {/* Right side charts/panel area (4 cols) */}
        <div className="lg:col-span-4 space-y-lg">
          {selectedRisk ? (
            <RiskDetailPanel
              risk={selectedRisk}
              onUpdateStatus={(id, status, comment) => {
                updateStatus.mutate({ id, status, comment }, {
                  onSuccess: (updatedRisk) => {
                    setSelectedRisk(updatedRisk);
                  }
                });
              }}
              onClose={() => setSelectedRisk(null)}
            />
          ) : (
            <>
              <RiskKpiRadial
                criticalCount={criticalCount}
                highCount={highCount}
                normalCount={normalCount}
              />
              
              <RiskRootCauses />

              {/* AI Forecast panel matching design */}
              <div className="p-lg rounded-xl bg-primary text-on-primary shadow-xl overflow-hidden relative">
                {/* Decoration */}
                <div className="absolute top-0 right-0 p-lg opacity-10">
                  <Icon name="psychology" size={80} />
                </div>
                <h4 className="font-label-md text-label-md uppercase tracking-widest mb-md">
                  {t('aiForecast')}
                </h4>
                <p className="font-body-lg text-body-lg font-medium italic mb-lg leading-relaxed text-white">
                  {"\"Reducing stagnation in the Technical Validation stage by just 3 days could recover up to $1.2M in projected revenue this quarter.\""}
                </p>
                <button className="bg-white text-primary px-lg py-sm rounded-full font-label-sm font-bold hover:bg-opacity-90 transition-all shadow-md">
                  {t('generatePlan')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
