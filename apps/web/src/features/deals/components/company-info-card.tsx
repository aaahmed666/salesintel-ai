'use client';

import { useTranslations } from 'next-intl';
import type { CompanyInfo } from '@salesintel/types';

interface CompanyInfoCardProps {
  company: CompanyInfo;
}

export function CompanyInfoCard({ company }: CompanyInfoCardProps) {
  const t = useTranslations('dealProfile.company');

  const formattedRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(company.annualRevenue);

  return (
    <div className="bento-card bg-surface-container-lowest p-lg">
      <h4 className="font-headline-md text-headline-md mb-md font-bold text-on-background">
        {t('title')}
      </h4>
      <p className="mb-lg text-body-md text-on-surface-variant leading-relaxed">
        {company.description}
      </p>
      <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-base">
            {t('website')}
          </p>
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body-md text-body-md text-primary hover:underline"
          >
            {company.website.replace(/^https?:\/\//, '')}
          </a>
        </div>
        <div>
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-base">
            {t('industry')}
          </p>
          <p className="font-body-md text-body-md text-on-background font-medium">
            {company.industry}
          </p>
        </div>
        <div>
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-base">
            {t('employees')}
          </p>
          <p className="font-body-md text-body-md text-on-background font-medium">
            {company.employeeCount.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-base">
            {t('revenue')}
          </p>
          <p className="font-body-md text-body-md text-on-background font-medium">
            {formattedRevenue}
          </p>
        </div>
        <div>
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-base">
            {t('headquarters')}
          </p>
          <p className="font-body-md text-body-md text-on-background font-medium">
            {company.headquarters}
          </p>
        </div>
      </div>
    </div>
  );
}
