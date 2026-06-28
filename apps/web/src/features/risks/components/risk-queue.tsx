'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from '@/features/shell';
import { RiskCard } from './risk-card';
import type { DealRisk, RiskStatus } from '@salesintel/types';

interface RiskQueueProps {
  risks: DealRisk[];
  selectedId?: string;
  onSelectRisk: (risk: DealRisk) => void;
}

export function RiskQueue({ risks, selectedId, onSelectRisk }: RiskQueueProps) {
  const t = useTranslations('risks');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<RiskStatus | 'all'>('all');

  const filteredRisks = useMemo(() => {
    let result = [...risks];

    // Search query filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.company.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.repName.toLowerCase().includes(q),
      );
    }

    // Status tab filter
    if (activeTab !== 'all') {
      result = result.filter((r) => r.status === activeTab);
    }

    return result;
  }, [risks, search, activeTab]);

  const tabs: { key: RiskStatus | 'all'; label: string }[] = [
    { key: 'all', label: t('tabs.all') },
    { key: 'detected', label: t('tabs.detected') },
    { key: 'under_review', label: t('tabs.under_review') },
    { key: 'escalated', label: t('tabs.escalated') },
    { key: 'resolved', label: t('tabs.resolved') },
  ];

  return (
    <div className="glass-card rounded-xl p-lg space-y-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
        <h3 className="font-headline-md text-headline-md font-bold text-on-background">
          {t('queueTitle')}
        </h3>
        
        {/* Search input field */}
        <div className="relative flex items-center bg-surface-container rounded-full px-md py-xs border border-outline-variant w-full sm:w-64">
          <Icon name="search" className="text-on-surface-variant mr-xs" size={18} />
          <input
            type="text"
            placeholder="Search risks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-body-sm font-body-sm w-full focus:ring-0 focus:border-none p-0"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-outline-variant overflow-x-auto">
        <nav className="flex gap-md whitespace-nowrap" aria-label="Risk tabs">
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`border-b-2 py-xs font-label-md text-label-md transition-all outline-none pb-sm ${
                  active
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* List */}
      <div className="space-y-md max-h-[35rem] overflow-y-auto pr-xs">
        {filteredRisks.length === 0 ? (
          <div className="text-center py-xl text-on-surface-variant">
            <Icon name="assignment_turned_in" size={36} className="mb-sm text-outline-variant" />
            <p className="text-body-md">No risks found.</p>
          </div>
        ) : (
          filteredRisks.map((risk) => (
            <RiskCard
              key={risk.id}
              risk={risk}
              active={selectedId === risk.id}
              onClick={() => onSelectRisk(risk)}
            />
          ))
        )}
      </div>
    </div>
  );
}
