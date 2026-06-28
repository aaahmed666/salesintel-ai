'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Badge, Button, Card, cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';

type Range = 'd' | 'w' | 'm' | 'y';

const REVENUE_SERIES = [
  { name: 'Jan', gross: 1_200_000, forecast: 1_180_000 },
  { name: 'Feb', gross: 1_320_000, forecast: 1_300_000 },
  { name: 'Mar', gross: 1_500_000, forecast: 1_460_000 },
  { name: 'Apr', gross: 1_720_000, forecast: 1_690_000 },
  { name: 'May', gross: 2_050_000, forecast: 2_010_000 },
  { name: 'Jun', gross: 2_482_900, forecast: 2_650_000 },
];

const FUNNEL = [
  { key: 'newLeads', value: 1_204, pct: 100 },
  { key: 'qualified', value: 842, pct: 70 },
  { key: 'negotiation', value: 245, pct: 20 },
  { key: 'closedWon', value: 142, pct: 12 },
] as const;

const REGIONS = [
  { region: 'North America (East)', volume: '$842k', share: 34, sentiment: 'high' as const },
  { region: 'EMEA Central', volume: '$612k', share: 24, sentiment: 'neutral' as const },
  { region: 'APAC South', volume: '$495k', share: 18, sentiment: 'high' as const },
  { region: 'LATAM', volume: '$320k', share: 12, sentiment: 'low' as const },
];

const SENTIMENT_BADGE: Record<'high' | 'neutral' | 'low', 'success' | 'neutral' | 'error'> = {
  high: 'success',
  neutral: 'neutral',
  low: 'error',
};

export function RevenueAnalyticsScreen() {
  const t = useTranslations('analytics');
  const [range, setRange] = useState<Range>('m');

  const kpis = [
    { key: 'revenue', value: '$2,482,900', change: '+12.4%', tone: 'up' as const, hint: t('kpis.revenueHint') },
    { key: 'conversion', value: '24.8%', change: '-2.1%', tone: 'down' as const, hint: t('kpis.conversionHint') },
    { key: 'activeDeals', value: '142', change: t('kpis.stable'), tone: 'flat' as const, hint: t('kpis.activeDealsHint') },
    { key: 'avgDealSize', value: '$17,485', change: t('kpis.highImpact'), tone: 'up' as const, hint: t('kpis.avgDealSizeHint') },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-lg px-sm pb-xl sm:px-md">
      {/* Header + range toggle */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="font-display text-headline-lg font-bold text-on-surface">{t('pageTitle')}</h1>
          <p className="mt-base text-body-md text-on-surface-variant">{t('subtitle')}</p>
        </div>
        <div className="flex rounded-xl border border-outline-variant/60 bg-surface-container p-1">
          {(['d', 'w', 'm', 'y'] as Range[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={cn(
                'rounded-lg px-md py-1.5 text-label-sm font-semibold transition-all',
                range === r ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface',
              )}
            >
              {t(`ranges.${r}`)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.key} className="p-lg">
            <div className="mb-md flex items-center justify-between">
              <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                {t(`kpis.${kpi.key}`)}
              </p>
              <span
                className={cn(
                  'rounded-full px-sm py-0.5 text-label-sm font-bold',
                  kpi.tone === 'up' && 'bg-green-50 text-green-700',
                  kpi.tone === 'down' && 'bg-error-container/15 text-error',
                  kpi.tone === 'flat' && 'bg-surface-container text-on-surface-variant',
                )}
              >
                {kpi.change}
              </span>
            </div>
            <h3 className="font-display text-headline-md font-black text-on-background">{kpi.value}</h3>
            <p className="mt-base text-body-sm text-on-surface-variant">{kpi.hint}</p>
          </Card>
        ))}
      </div>

      {/* Revenue growth + AI / risk */}
      <div className="grid grid-cols-1 gap-md lg:grid-cols-3">
        <Card className="p-lg lg:col-span-2">
          <h2 className="mb-md font-display text-title-md font-bold text-on-surface">{t('revenueGrowth')}</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={REVENUE_SERIES} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="grossArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4648d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4648d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#767586" fontSize={11} tickLine={false} />
                <YAxis stroke="#767586" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="gross"
                  name={t('grossRevenue')}
                  stroke="#4648d4"
                  strokeWidth={3}
                  fill="url(#grossArea)"
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  name={t('forecast')}
                  stroke="#6b38d4"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-md">
          <Card className="bg-primary p-lg text-on-primary">
            <div className="mb-base flex items-center gap-2 text-label-sm uppercase tracking-wider">
              <Icon name="auto_awesome" size={18} />
              {t('aiSuggestions')}
            </div>
            <h3 className="font-display text-title-md font-bold">{t('aiSuggestionTitle')}</h3>
            <p className="mt-base text-body-sm text-on-primary/85">{t('aiSuggestionBody')}</p>
            <Button variant="secondary" fullWidth className="mt-md bg-white/15 text-on-primary hover:bg-white/25">
              {t('generateActionPlan')}
            </Button>
          </Card>
          <Card className="border-s-4 border-s-error p-lg">
            <div className="mb-base flex items-center gap-2 text-label-sm font-semibold uppercase tracking-wider text-error">
              <Icon name="warning" size={18} />
              {t('riskAnalysis')}
            </div>
            <h3 className="font-display text-body-lg font-bold text-on-surface">{t('riskTitle')}</h3>
            <p className="mt-base text-body-sm text-on-surface-variant">{t('riskBody')}</p>
          </Card>
        </div>
      </div>

      {/* Funnel + regional */}
      <div className="grid grid-cols-1 gap-md lg:grid-cols-2">
        <Card className="p-lg">
          <h2 className="mb-md font-display text-title-md font-bold text-on-surface">{t('funnelEfficiency')}</h2>
          <div className="space-y-md">
            {FUNNEL.map((step) => (
              <div key={step.key}>
                <div className="mb-1 flex items-center justify-between text-body-sm">
                  <span className="text-on-surface-variant">{t(`funnel.${step.key}`)}</span>
                  <span className="font-bold text-on-surface">{step.value.toLocaleString()}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-surface-container">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${step.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-md flex items-center justify-between border-t border-outline-variant/40 pt-md text-body-sm">
            <span className="text-on-surface-variant">{t('leadVelocity')}</span>
            <span className="font-bold text-primary">{t('days', { count: 24 })}</span>
          </p>
        </Card>

        <Card className="p-lg">
          <h2 className="mb-md font-display text-title-md font-bold text-on-surface">{t('regionalTitle')}</h2>
          <table className="w-full text-start text-body-sm">
            <thead>
              <tr className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                <th className="pb-base text-start font-semibold">{t('region')}</th>
                <th className="pb-base text-start font-semibold">{t('volume')}</th>
                <th className="pb-base text-start font-semibold">{t('marketShare')}</th>
                <th className="pb-base text-end font-semibold">{t('sentiment')}</th>
              </tr>
            </thead>
            <tbody>
              {REGIONS.map((row) => (
                <tr key={row.region} className="border-t border-outline-variant/40">
                  <td className="py-md font-medium text-on-surface">{row.region}</td>
                  <td className="py-md text-on-surface">{row.volume}</td>
                  <td className="py-md">
                    <div className="flex items-center gap-2">
                      <span className="text-on-surface-variant">{row.share}%</span>
                      <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-surface-container sm:block">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${row.share}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-md text-end">
                    <Badge tone={SENTIMENT_BADGE[row.sentiment]}>{t(`sentiments.${row.sentiment}`)}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
