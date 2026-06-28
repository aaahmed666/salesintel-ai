'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import {
  useDealProfile,
  useUpdateTaskStatus,
  useAddTask,
  useAddNote,
} from '../queries';

import { DealProfileHeader } from './deal-profile-header';
import { DealOverviewStats } from './deal-overview-stats';
import { CompanyInfoCard } from './company-info-card';
import { ContactsStakeholdersCard } from './contacts-stakeholders-card';
import { ActivityTimelineCard } from './activity-timeline-card';
import { TasksChecklistCard } from './tasks-checklist-card';
import { NotesCard } from './notes-card';
import { DocumentsCard } from './documents-card';
import { AIInsightsPanel } from './ai-insights-panel';

interface DealProfileScreenProps {
  dealId: string;
}

type TabType = 'overview' | 'stakeholders' | 'activities' | 'documents' | 'ai-insights';

export function DealProfileScreen({ dealId }: DealProfileScreenProps) {
  const t = useTranslations('dealProfile');
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const { data: deal, isLoading, isError, refetch } = useDealProfile(dealId);
  const toggleTaskStatus = useUpdateTaskStatus(dealId);
  const addTask = useAddTask(dealId);
  const addNote = useAddNote(dealId);

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

  if (isError || !deal) {
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

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'overview', label: t('tabs.overview'), icon: 'dashboard' },
    { key: 'stakeholders', label: t('tabs.stakeholders'), icon: 'group' },
    { key: 'activities', label: t('tabs.activities'), icon: 'event_note' },
    { key: 'documents', label: t('tabs.documents'), icon: 'description' },
    { key: 'ai-insights', label: t('tabs.aiInsights'), icon: 'auto_awesome' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-lg px-sm sm:px-md">
      {/* Deal Main Header */}
      <DealProfileHeader deal={deal} />

      {/* Primary KPI Stats */}
      <DealOverviewStats deal={deal} />

      {/* Tabs Navigation */}
      <div className="border-b border-outline-variant">
        <nav className="flex gap-md overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-xs border-b-2 px-sm py-md font-label-md text-label-md transition-all whitespace-nowrap outline-none ${
                  active
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-on-surface-variant hover:border-outline-variant hover:text-on-surface'
                }`}
              >
                <Icon name={tab.icon} size={18} filled={active} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Render active section tab content */}
      <div className="mt-lg">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-lg lg:grid-cols-12">
            {/* Left Main Dashboard Area (8 cols) */}
            <div className="space-y-lg lg:col-span-8">
              <CompanyInfoCard company={deal.company} />
              
              {/* Opportunity Summary pain points and requirements */}
              <div className="bento-card bg-surface-container-lowest p-lg">
                <h4 className="font-headline-md text-headline-md mb-md font-bold text-on-background">
                  Opportunity Summary
                </h4>
                <p className="text-body-md text-on-surface-variant mb-md leading-relaxed">
                  {deal.opportunitySummary.description}
                </p>
                <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
                  <div>
                    <h5 className="font-label-md text-label-md font-bold text-error mb-xs">Pain Points</h5>
                    <ul className="list-disc list-inside space-y-base text-body-sm text-on-surface-variant">
                      {deal.opportunitySummary.painPoints.map((pt, idx) => (
                        <li key={idx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-label-md text-label-md font-bold text-tertiary mb-xs">Key Requirements</h5>
                    <ul className="list-disc list-inside space-y-base text-body-sm text-on-surface-variant">
                      {deal.opportunitySummary.keyRequirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <ActivityTimelineCard activities={deal.activities} meetings={deal.meetings} />
            </div>

            {/* Right Sidebar Widgets Area (4 cols) */}
            <div className="space-y-lg lg:col-span-4">
              <AIInsightsPanel deal={deal} />
              
              <TasksChecklistCard
                tasks={deal.tasks}
                onToggleStatus={(taskId, completed) => toggleTaskStatus.mutate({ taskId, completed })}
                onAddTask={(task) => addTask.mutate(task)}
              />

              <NotesCard
                notes={deal.notes}
                onAddNote={(note) => addNote.mutate(note)}
              />
            </div>
          </div>
        )}

        {activeTab === 'stakeholders' && (
          <div className="space-y-lg">
            <ContactsStakeholdersCard contacts={deal.contacts} stakeholders={deal.stakeholders} />
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-lg">
            <ActivityTimelineCard activities={deal.activities} meetings={deal.meetings} />
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="max-w-3xl mx-auto">
            <DocumentsCard documents={deal.documents} />
          </div>
        )}

        {activeTab === 'ai-insights' && (
          <div className="grid grid-cols-1 gap-lg md:grid-cols-2 max-w-4xl mx-auto">
            <AIInsightsPanel deal={deal} />
            <div className="bento-card bg-surface-container-lowest p-lg">
              <h4 className="font-headline-md text-headline-md font-bold mb-md">Competitor Threat Level</h4>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                {deal.opportunitySummary.competitorActivity}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
