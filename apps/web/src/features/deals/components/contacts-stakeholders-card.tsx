'use client';

import { useTranslations } from 'next-intl';
import { Icon } from '@/features/shell';
import type { Contact, Stakeholder } from '@salesintel/types';

interface ContactsStakeholdersCardProps {
  contacts: Contact[];
  stakeholders: Stakeholder[];
}

export function ContactsStakeholdersCard({ contacts, stakeholders }: ContactsStakeholdersCardProps) {
  const t = useTranslations('dealProfile.stakeholders');

  const sentimentColors = {
    positive: 'bg-green-500',
    neutral: 'bg-outline-variant',
    negative: 'bg-error',
  };

  return (
    <div className="grid grid-cols-1 gap-lg lg:grid-cols-2">
      {/* Stakeholders Card */}
      <div className="bento-card bg-surface-container-lowest p-lg">
        <div className="mb-md flex items-center justify-between">
          <h4 className="font-label-md text-label-md font-bold uppercase tracking-widest text-on-surface-variant">
            {t('title')}
          </h4>
          <button className="flex items-center text-on-surface-variant hover:text-primary transition-colors">
            <Icon name="person_add" size={20} />
          </button>
        </div>
        <div className="space-y-md">
          {stakeholders.map((sh) => (
            <div key={sh.id} className="flex items-center gap-md">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-container">
                {sh.avatarUrl ? (
                  <img src={sh.avatarUrl} alt={sh.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-bold text-primary">
                    {sh.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <p className="font-label-md text-label-md font-bold text-on-background">{sh.name}</p>
                <p className="text-label-sm text-on-surface-variant">
                  {t(`categories.${sh.category}` as never)} • {sh.role}
                </p>
              </div>
              {sh.category === 'champion' ? (
                <Icon name="verified" className="text-primary" filled />
              ) : (
                <div className={`h-2 w-2 rounded-full ${sentimentColors[sh.status]}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contacts List Card */}
      <div className="bento-card bg-surface-container-lowest p-lg">
        <h4 className="font-label-md text-label-md font-bold uppercase tracking-widest text-on-surface-variant mb-md">
          Contacts Directory
        </h4>
        <div className="space-y-md">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-center gap-md">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-container">
                {contact.avatarUrl ? (
                  <img src={contact.avatarUrl} alt={contact.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-bold text-secondary">
                    {contact.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-xs">
                  <p className="font-label-md text-label-md font-bold text-on-background">{contact.name}</p>
                  {contact.isChampion && (
                    <span className="rounded-full bg-primary-container/10 px-xs py-0.5 font-label-sm text-[10px] text-primary font-bold">
                      Champion
                    </span>
                  )}
                </div>
                <p className="text-label-sm text-on-surface-variant">{contact.role}</p>
              </div>
              <div className="flex items-center gap-sm text-on-surface-variant">
                <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors" title={contact.email}>
                  <Icon name="mail" size={18} />
                </a>
                <a href={`tel:${contact.phone}`} className="hover:text-primary transition-colors" title={contact.phone}>
                  <Icon name="call" size={18} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
