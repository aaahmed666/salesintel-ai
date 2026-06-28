'use client';

import { useTranslations } from 'next-intl';
import { Icon } from '@/features/shell';
import type { TimelineActivity, DealProfile } from '@salesintel/types';

interface ActivityTimelineCardProps {
  activities: TimelineActivity[];
  meetings: DealProfile['meetings'];
}

export function ActivityTimelineCard({ activities, meetings }: ActivityTimelineCardProps) {
  const t = useTranslations('dealProfile.activities');

  const activityIcons = {
    email: { icon: 'mail', bg: 'bg-primary-container/10 text-primary border border-primary/20' },
    call: { icon: 'call', bg: 'bg-tertiary/10 text-tertiary border border-tertiary/20' },
    meeting: { icon: 'groups', bg: 'bg-secondary-container/10 text-secondary border border-secondary-container/20' },
    task: { icon: 'task_alt', bg: 'bg-green-100 text-green-700 border border-green-200' },
    document: { icon: 'description', bg: 'bg-amber-100 text-amber-700 border border-amber-200' },
  };

  return (
    <div className="grid grid-cols-1 gap-lg lg:grid-cols-3">
      {/* Activity Timeline (2/3 width) */}
      <div className="bento-card bg-surface-container-lowest p-lg lg:col-span-2">
        <div className="mb-xl flex justify-between items-center">
          <h4 className="font-headline-md text-headline-md font-bold">{t('title')}</h4>
          <div className="flex gap-xs">
            <button className="p-xs hover:bg-surface-container rounded-lg transition-colors">
              <Icon name="filter_list" className="text-on-surface-variant" size={20} />
            </button>
            <button className="p-xs hover:bg-surface-container rounded-lg transition-colors">
              <Icon name="search" className="text-on-surface-variant" size={20} />
            </button>
          </div>
        </div>

        {/* Timeline container with vertical connector line */}
        <div className="relative space-y-xl ms-xs before:absolute before:top-0 before:bottom-0 before:w-[2px] before:bg-outline-variant ltr:before:left-[19px] rtl:before:right-[19px]">
          {activities.map((act) => {
            const config = activityIcons[act.type as keyof typeof activityIcons] || activityIcons.email;

            return (
              <div key={act.id} className="relative ltr:pl-xl rtl:pr-xl">
                {/* Icon wrapper */}
                <div className="absolute top-0 w-10 h-10 rounded-full flex items-center justify-center z-10 bg-surface-container-lowest ltr:left-0 rtl:right-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bg}`}>
                    <Icon name={config.icon} size={18} />
                  </div>
                </div>

                {/* Content Box */}
                <div className="bg-surface-container-low/50 p-md rounded-xl border border-outline-variant">
                  <div className="flex justify-between items-start mb-xs flex-wrap gap-2">
                    <h5 className="font-label-md text-label-md font-bold">{act.title}</h5>
                    <span className="text-label-sm text-on-surface-variant">
                      {new Date(act.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    {act.description}
                  </p>
                  {act.details && (
                    <div className="mt-sm flex items-center gap-xs text-primary font-label-sm text-label-sm">
                      <Icon name="visibility" size={14} />
                      <span>{act.details}</span>
                    </div>
                  )}
                  {act.transcriptAvailable && (
                    <div className="mt-sm bg-surface-container-highest/30 px-sm py-xs rounded-lg flex items-center gap-sm">
                      <Icon name="graphic_eq" className="text-tertiary" size={16} />
                      <span className="text-label-sm italic text-on-surface-variant">
                        {t('transcript')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button className="w-full mt-xl text-primary font-label-md text-label-md py-sm border-t border-outline-variant hover:bg-surface-container/50 transition-all rounded-b-xl">
          {t('fullHistory')}
        </button>
      </div>

      {/* Related Meetings (1/3 width) */}
      <div className="bento-card bg-surface-container-lowest p-lg">
        <h4 className="font-label-md text-label-md font-bold uppercase tracking-widest text-on-surface-variant mb-md">
          Related Meetings
        </h4>
        <div className="space-y-md">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="p-md rounded-xl border border-outline-variant bg-surface-container-low/30 hover:border-primary transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start gap-sm mb-xs">
                <p className="font-label-md text-label-md font-bold text-on-background line-clamp-1">
                  {meeting.title}
                </p>
                <span className="text-[10px] text-on-surface-variant shrink-0 bg-surface-container px-sm py-0.5 rounded-full font-semibold">
                  {meeting.duration}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant mb-sm">
                {new Date(meeting.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="text-body-sm text-on-surface-variant line-clamp-2 leading-relaxed italic">
                {"\""}{meeting.aiSummary}{"\""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
