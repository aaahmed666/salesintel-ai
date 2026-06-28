'use client';

import { useTranslations } from 'next-intl';
import { Icon } from '@/features/shell';
import type { DealProfile } from '@salesintel/types';

interface AIInsightsPanelProps {
  deal: DealProfile;
}

export function AIInsightsPanel({ deal }: AIInsightsPanelProps) {
  const t = useTranslations('dealProfile.aiInsights');

  // Find next best actions if any, or provide static recommendation matching design
  const primaryAction = deal.nextActions[0]?.action || 'Send Security Compliance PDF to Marcus Chen';
  const reasonText = 'Closing signals: Marcus opened the proposal twice in the last hour but hasn\'t responded.';

  return (
    <div className="relative overflow-hidden bento-card bg-inverse-surface text-inverse-on-surface p-lg">
      {/* Abstract background blur decoration matching code.html design */}
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-sm mb-lg">
          <Icon name="auto_awesome" className="text-primary-fixed" size={24} />
          <h4 className="font-headline-md text-headline-md font-bold">{t('title')}</h4>
        </div>

        <div className="space-y-md">
          {/* Next Best Action Box */}
          <div className="bg-surface-container-low/10 p-md rounded-xl border border-white/5">
            <p className="font-label-sm text-label-sm text-primary-fixed-dim uppercase mb-xs tracking-wider">
              {t('nextAction')}
            </p>
            <p className="text-body-md font-medium text-white">{primaryAction}</p>
            <p className="text-label-sm text-white/60 mt-xs leading-relaxed">{reasonText}</p>
          </div>

          {/* Risk Factors List */}
          <div>
            <p className="font-label-sm text-label-sm text-primary-fixed-dim uppercase mb-xs tracking-wider">
              {t('riskFactors')}
            </p>
            <ul className="space-y-xs">
              <li className="flex items-start gap-xs text-body-sm text-white/95">
                <Icon name="warning" className="text-error shrink-0" size={18} />
                <span>{"Decision maker (CTO) hasn't attended last 2 meetings."}</span>
              </li>
              <li className="flex items-start gap-xs text-body-sm text-white/95">
                <Icon name="info" className="text-tertiary-fixed shrink-0" size={18} />
                <span>{"Competitor \"Logix\" recently met with the procurement team."}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
