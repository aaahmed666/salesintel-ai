'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button, cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import { useNotifications, useMarkRead, useMarkAllRead } from '../queries';
import type { AppNotification } from '@salesintel/types';

type FilterType = 'all' | 'success' | 'warning' | 'error' | 'info';
type TabType = 'all' | 'mentions' | 'system' | 'alerts';

export function NotificationCenter() {
  const t = useTranslations('notifications');
  const { data: notifications = [], isLoading, isError, refetch } = useNotifications();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);

  // Filter list
  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    // Filter by tab
    if (activeTab === 'mentions') {
      result = result.filter((n) => n.title.toLowerCase().includes('mention') || n.body.toLowerCase().includes('@'));
    } else if (activeTab === 'system') {
      result = result.filter((n) => n.title.toLowerCase().includes('system') || n.title.toLowerCase().includes('engine'));
    } else if (activeTab === 'alerts') {
      result = result.filter((n) => n.title.toLowerCase().includes('risk') || n.title.toLowerCase().includes('alert'));
    }

    // Filter by severity type
    if (filterType !== 'all') {
      // Map notifications severity type (we can mock this matching status or type tags)
      const mappedType = (n: AppNotification): FilterType => {
        const title = n.title.toLowerCase();
        if (title.includes('success') || title.includes('completed') || title.includes('saved')) return 'success';
        if (title.includes('warning') || title.includes('stagnant')) return 'warning';
        if (title.includes('error') || title.includes('fail')) return 'error';
        return 'info';
      };
      result = result.filter((n) => mappedType(n) === filterType);
    }

    // Search query filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q));
    }

    return result;
  }, [notifications, activeTab, filterType, search]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-md">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="font-label-md text-label-md text-on-surface-variant">Loading Notifications...</p>
      </div>
    );
  }

  const getIconConfig = (n: AppNotification) => {
    const title = n.title.toLowerCase();
    if (title.includes('success') || title.includes('completed') || title.includes('saved')) {
      return { name: 'check_circle', color: 'text-green-600 bg-green-50' };
    }
    if (title.includes('warning') || title.includes('stagnant')) {
      return { name: 'warning', color: 'text-orange-600 bg-orange-50' };
    }
    if (title.includes('error') || title.includes('fail')) {
      return { name: 'error', color: 'text-error bg-error-container/10' };
    }
    return { name: 'info', color: 'text-primary bg-primary-container/10' };
  };

  return (
    <div className="space-y-lg px-sm sm:px-md max-w-7xl mx-auto pb-xl">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-xl">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-base font-bold">
            {t('pageTitle')}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex gap-sm">
          <Button
            variant="secondary"
            onClick={() => markAllRead.mutate()}
            className="rounded-xl font-label-md text-label-md transition-colors"
          >
            {t('markAllRead')}
          </Button>
        </div>
      </div>

      {/* Grid structure split list & details drawer */}
      <div className="grid grid-cols-1 gap-lg lg:grid-cols-12">
        {/* Main List view */}
        <div className="col-span-12 lg:col-span-8 space-y-md">
          <div className="glass-card rounded-xl p-lg space-y-md">
            {/* Filters panel toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
              {/* Type filter pills */}
              <div className="flex flex-wrap gap-xs">
                {(['all', 'success', 'warning', 'error', 'info'] as FilterType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-sm py-1 rounded-full font-label-sm text-[11px] border transition-all ${
                      filterType === type
                        ? 'border-primary bg-primary-container/10 text-primary font-bold'
                        : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {type === 'all' ? 'All Types' : t(`types.${type}` as never)}
                  </button>
                ))}
              </div>

              {/* Search bar */}
              <div className="relative flex items-center bg-surface-container rounded-full px-md py-xs border border-outline-variant w-full sm:w-60">
                <Icon name="search" className="text-on-surface-variant mr-xs" size={18} />
                <input
                  type="text"
                  placeholder="Search feeds..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-body-sm font-body-sm w-full focus:ring-0 p-0"
                />
              </div>
            </div>

            {/* Tab navigation */}
            <div className="border-b border-outline-variant overflow-x-auto">
              <nav className="flex gap-md whitespace-nowrap" aria-label="Notification Center Tabs">
                {([
                  { key: 'all', label: 'All Feeds' },
                  { key: 'mentions', label: t('mentions') },
                  { key: 'system', label: t('system') },
                  { key: 'alerts', label: t('alerts') },
                ] as { key: TabType; label: string }[]).map((tab) => {
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

            {/* Items list */}
            <div className="space-y-sm max-h-[35rem] overflow-y-auto pr-xs">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-xl text-on-surface-variant">
                  <Icon name="notifications_off" size={40} className="mb-sm text-outline-variant" />
                  <p className="text-body-md font-semibold">No alerts found</p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const config = getIconConfig(notif);
                  return (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setSelectedNotification(notif);
                        if (!notif.read) markRead.mutate(notif.id);
                      }}
                      className={`flex items-start gap-md p-md rounded-xl border border-outline-variant/60 cursor-pointer hover:bg-surface-container-low transition-all ${
                        !notif.read ? 'bg-primary-container/5 border-primary/20' : 'bg-surface'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                        <Icon name={config.name} size={20} />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start gap-sm flex-wrap">
                          <h5 className={`font-label-md text-label-md text-on-background ${!notif.read ? 'font-black' : 'font-semibold'}`}>
                            {notif.title}
                          </h5>
                          <span className="text-[10px] text-on-surface-variant">
                            {new Date(notif.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-body-sm text-on-surface-variant mt-xs leading-relaxed">
                          {notif.body}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right side Detail Drawer panel */}
        <div className="col-span-12 lg:col-span-4">
          {selectedNotification ? (
            <div className="glass-card rounded-xl p-lg space-y-md relative h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start border-b border-outline-variant/30 pb-md mb-md">
                  <h4 className="font-headline-md text-headline-md font-bold text-on-background">
                    Alert Detail
                  </h4>
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="text-on-surface-variant hover:text-primary transition-colors p-xs hover:bg-surface-container rounded-lg"
                  >
                    <Icon name="close" size={20} />
                  </button>
                </div>
                
                <div className="space-y-md">
                  <div className="flex items-center gap-md bg-surface-container-low/50 p-md rounded-xl border border-outline-variant/30">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      getIconConfig(selectedNotification).color
                    )}>
                      <Icon name={getIconConfig(selectedNotification).name} size={22} />
                    </div>
                    <div>
                      <p className="font-label-md text-label-md font-bold text-on-background">
                        {selectedNotification.title}
                      </p>
                      <p className="text-[10px] text-on-surface-variant mt-base">
                        {new Date(selectedNotification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">
                      Message
                    </h5>
                    <p className="text-body-md text-on-surface-variant leading-relaxed bg-surface p-md rounded-xl border border-outline-variant/30">
                      {selectedNotification.body}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">
                      Alert Metadata
                    </h5>
                    <pre className="text-[11px] font-mono text-on-surface-variant bg-surface-container-low p-md rounded-xl border border-outline-variant/30 overflow-x-auto">
                      {JSON.stringify({ id: selectedNotification.id, actionNeeded: true, read: selectedNotification.read }, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="border-t border-outline-variant/30 pt-md mt-md flex gap-sm">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setSelectedNotification(null)}
                  className="rounded-xl font-label-md"
                >
                  Dismiss Detail
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-lg">
              {/* Notification Summary Card */}
              <div className="bg-surface-container border border-outline-variant rounded-xl p-lg">
                <h3 className="font-headline-md text-[20px] text-on-surface font-bold mb-md">
                  {t('insightsSummary')}
                </h3>
                <div className="space-y-md">
                  <div className="flex justify-between items-center py-sm border-b border-outline-variant/30">
                    <span className="font-label-md text-on-surface-variant">{t('unreadMentions')}</span>
                    <span className="font-bold text-primary">2</span>
                  </div>
                  <div className="flex justify-between items-center py-sm border-b border-outline-variant/30">
                    <span className="font-label-md text-on-surface-variant">{t('atRiskDeals')}</span>
                    <span className="font-bold text-error">1</span>
                  </div>
                  <div className="flex justify-between items-center py-sm border-b border-outline-variant/30">
                    <span className="font-label-md text-on-surface-variant">{t('opportunities')}</span>
                    <span className="font-bold text-green-600 dark:text-green-400">3</span>
                  </div>
                </div>
                <button className="w-full mt-lg py-md rounded-lg border border-primary text-primary font-label-md hover:bg-primary-container/10 transition-all">
                  {t('configurePref')}
                </button>
              </div>

              {/* Promo/Feature Card */}
              <div className="bg-primary p-lg rounded-xl text-white relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <Icon name="smart_toy" size={120} />
                </div>
                <h3 className="font-headline-md text-[20px] font-bold relative z-10">
                  {t('aiBriefTitle')}
                </h3>
                <p className="font-body-sm text-body-sm mt-sm opacity-90 relative z-10">
                  {t('aiBriefDesc')}
                </p>
                <button className="mt-lg px-md py-xs bg-white text-primary rounded-full font-label-md hover:shadow-lg transition-all relative z-10">
                  {t('aiBriefBtn')}
                </button>
              </div>

              {/* Recent Team Activity */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
                <h3 className="font-headline-md text-[18px] text-on-surface font-bold mb-md">
                  {t('teamOverview')}
                </h3>
                <div className="space-y-md">
                  <div className="flex items-center gap-md">
                    <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center font-bold text-white text-[12px]">JD</div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-label-md text-on-surface truncate">John Doe</p>
                      <p className="font-label-sm text-on-surface-variant text-[11px]">{t('teamOverviewSub')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-md">
                    <div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center font-bold text-white text-[12px]">AM</div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-label-md text-on-surface truncate">Alice Meyer</p>
                      <p className="font-label-sm text-on-surface-variant text-[11px]">{t('teamOverviewSub2')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
