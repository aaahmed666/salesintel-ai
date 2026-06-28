'use client';

import { useTranslations } from 'next-intl';
import { Icon } from '@/features/shell';
import type { Document } from '@salesintel/types';

interface DocumentsCardProps {
  documents: Document[];
}

export function DocumentsCard({ documents }: DocumentsCardProps) {
  const t = useTranslations('dealProfile.documents');

  const fileIcons = {
    pdf: { icon: 'picture_as_pdf', color: 'text-error bg-error-container/10' },
    doc: { icon: 'description', color: 'text-primary bg-primary-container/10' },
    xls: { icon: 'table_view', color: 'text-green-700 bg-green-100' },
    ppt: { icon: 'present_to_all', color: 'text-orange-700 bg-orange-100' },
  };

  return (
    <div className="bento-card bg-surface-container-lowest p-lg">
      <h4 className="font-label-md text-label-md font-bold uppercase tracking-widest text-on-surface-variant mb-md">
        {t('title')}
      </h4>
      <div className="space-y-md">
        {documents.map((doc) => {
          const config = fileIcons[doc.type] || fileIcons.doc;
          return (
            <div
              key={doc.id}
              className="flex items-center gap-md p-sm border border-outline-variant rounded-xl hover:border-primary transition-colors cursor-pointer bg-surface-container-low/10"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                <Icon name={config.icon} size={20} />
              </div>
              <div className="flex-grow">
                <p className="font-label-md text-label-md font-bold text-on-background line-clamp-1">
                  {doc.name}
                </p>
                <p className="text-[10px] text-on-surface-variant mt-xs">
                  {doc.size} • {t('uploadDate', {
                    date: new Date(doc.uploadDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }),
                  })}
                </p>
              </div>
              <button className="text-on-surface-variant hover:text-primary transition-colors p-xs rounded-lg hover:bg-surface-container shrink-0">
                <Icon name="download" size={20} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
