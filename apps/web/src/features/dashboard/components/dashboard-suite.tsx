'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Badge, Button, Card, Spinner, cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import {
  useRepDashboard,
  useManagerDashboard,
  useExecutiveDashboard,
} from '../queries';
import {
  MANAGER_KPIS,
  SALES_PERFORMANCE,
  DEAL_DISTRIBUTION,
  DEAL_DISTRIBUTION_TOTAL,
  TOP_PERFORMERS,
  CRITICAL_ALERTS,
  REP_KPIS,
  REP_RECENT_MEETINGS,
  REP_KEY_TOPICS,
  EXEC_KPIS,
  EXEC_REVENUE,
  EXEC_TOP_SOURCES,
} from '../data';

type RoleMode = 'representative' | 'manager' | 'executive';

const toneClass = (tone: string) =>
  tone === 'up'
    ? 'bg-green-50 text-green-700'
    : tone === 'down'
      ? 'bg-error-container/15 text-error'
      : 'bg-surface-container text-on-surface-variant';

function Initials({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-label-sm font-bold text-primary">
      {initials}
    </span>
  );
}

export function DashboardSuite() {
  const t = useTranslations('dashboards');
  const [roleMode, setRoleMode] = useState<RoleMode>('manager');

  const { isLoading: repLoading } = useRepDashboard();
  const { isLoading: managerLoading } = useManagerDashboard();
  const { isLoading: execLoading } = useExecutiveDashboard();

  if (repLoading || managerLoading || execLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-lg px-sm pb-xl sm:px-md">
      {/* Role switcher (functional: lets reviewers view each role's dashboard) */}
      <div className="flex justify-end">
        <div className="flex rounded-xl border border-outline-variant/60 bg-surface-container p-1">
          {(['representative', 'manager', 'executive'] as RoleMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setRoleMode(mode)}
              aria-pressed={roleMode === mode}
              className={cn(
                'whitespace-nowrap rounded-lg px-sm py-2 text-label-sm font-semibold transition-all',
                roleMode === mode
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface',
              )}
            >
              {t(mode === 'representative' ? 'rep' : mode === 'manager' ? 'manager' : 'executive')}
            </button>
          ))}
        </div>
      </div>

      {roleMode === 'manager' && <ManagerDashboard />}
      {roleMode === 'representative' && <RepresentativeDashboard />}
      {roleMode === 'executive' && <ExecutiveDashboard />}
    </div>
  );
}

/* ----------------------------- Manager ----------------------------- */
function ManagerDashboard() {
  const t = useTranslations('dashboards');
  const tm = useTranslations('dashboards.manager');
  return (
    <div className="space-y-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-label-sm font-bold uppercase tracking-wider text-primary">{tm('console')}</p>
          <h1 className="mt-1 font-display text-headline-lg font-bold text-on-surface">{t('greeting')}</h1>
          <p className="mt-base text-body-md text-on-surface-variant">{t('overview')}</p>
        </div>
        <Button variant="secondary" className="self-start">
          <Icon name="calendar_month" size={18} /> {t('thisMonth')}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-4">
        {MANAGER_KPIS.map((kpi) => {
          const feature = kpi.tone === 'feature';
          return (
            <Card
              key={kpi.key}
              className={cn('p-lg', feature && 'bg-primary text-on-primary')}
            >
              <div className="mb-md flex items-center justify-between">
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg',
                    feature ? 'bg-white/15 text-on-primary' : 'bg-surface-container text-primary',
                  )}
                >
                  <Icon name={kpi.icon} size={20} />
                </span>
                {kpi.change && (
                  <span className={cn('rounded-full px-sm py-0.5 text-label-sm font-bold', feature ? 'bg-white/15 text-on-primary' : toneClass(kpi.tone))}>
                    {kpi.change}
                  </span>
                )}
              </div>
              <p className={cn('text-label-sm', feature ? 'text-on-primary/80' : 'text-on-surface-variant')}>
                {tm(kpi.key)}
              </p>
              <h3 className="mt-1 font-display text-headline-md font-black">{kpi.value}</h3>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-md lg:grid-cols-3">
        <Card className="p-lg lg:col-span-2">
          <h2 className="mb-md font-display text-title-md font-bold text-on-surface">{tm('salesPerformance')}</h2>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={SALES_PERFORMANCE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#767586" fontSize={11} tickLine={false} />
                <YAxis stroke="#767586" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" name={tm('revenue')} stroke="#4648d4" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="benchmark" name={tm('target')} stroke="#8455ef" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-lg">
          <h2 className="mb-md font-display text-title-md font-bold text-on-surface">{tm('dealDistribution')}</h2>
          <div className="relative" style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={DEAL_DISTRIBUTION} dataKey="value" innerRadius={58} outerRadius={80} paddingAngle={2} startAngle={90} endAngle={-270}>
                  {DEAL_DISTRIBUTION.map((d) => (
                    <Cell key={d.key} fill={d.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-headline-md font-black text-on-surface">{DEAL_DISTRIBUTION_TOTAL}</span>
              <span className="text-label-sm text-on-surface-variant">{tm('active')}</span>
            </div>
          </div>
          <ul className="mt-md space-y-2">
            {DEAL_DISTRIBUTION.map((d) => (
              <li key={d.key} className="flex items-center justify-between text-body-sm">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                  {tm(d.key)}
                </span>
                <span className="font-bold text-on-surface">{d.value}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-md lg:grid-cols-2">
        <Card className="p-lg">
          <div className="mb-md flex items-center justify-between">
            <h2 className="font-display text-title-md font-bold text-on-surface">{tm('topPerformers')}</h2>
            <button type="button" className="text-label-sm font-semibold text-primary hover:underline">{t('viewAll')}</button>
          </div>
          <ul className="space-y-md">
            {TOP_PERFORMERS.map((p) => (
              <li key={p.rank} className="flex items-center gap-md">
                <span className="text-label-sm font-bold text-on-surface-variant">{p.rank}</span>
                <Initials name={p.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-md font-semibold text-on-surface">{p.name}</p>
                  <p className="text-body-sm text-on-surface-variant">{p.amount} · {tm('closed')}</p>
                </div>
                <span className="text-label-sm font-bold text-primary">{p.goal}% {tm('goal')}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-lg">
          <div className="mb-md flex items-center gap-2">
            <h2 className="font-display text-title-md font-bold text-on-surface">{tm('criticalAlerts')}</h2>
            <Badge tone="error">{CRITICAL_ALERTS.length} {tm('priority')}</Badge>
          </div>
          <table className="w-full text-start text-body-sm">
            <thead>
              <tr className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                <th className="pb-base text-start font-semibold">{tm('dealAccount')}</th>
                <th className="pb-base text-start font-semibold">{tm('issueType')}</th>
                <th className="pb-base text-end font-semibold">{tm('value')}</th>
              </tr>
            </thead>
            <tbody>
              {CRITICAL_ALERTS.map((a) => (
                <tr key={a.account} className="border-t border-outline-variant/40">
                  <td className="py-md">
                    <p className="font-semibold text-on-surface">{a.account}</p>
                    <p className="text-on-surface-variant">{a.deal}</p>
                  </td>
                  <td className="py-md">
                    <Badge tone={a.issue === 'atRisk' ? 'error' : a.issue === 'stuck' ? 'warning' : 'neutral'}>
                      {tm(a.issue)}
                    </Badge>
                  </td>
                  <td className="py-md text-end font-bold text-on-surface">{a.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div className="flex flex-col items-center justify-between gap-2 border-t border-outline-variant/40 pt-md text-body-sm text-on-surface-variant sm:flex-row">
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500" />{tm('liveStatus')}</span>
        <span>{tm('lastSynced')}</span>
      </div>
    </div>
  );
}

/* -------------------------- Representative -------------------------- */
function RepresentativeDashboard() {
  const t = useTranslations('dashboards');
  const tr = useTranslations('dashboards.rep');
  return (
    <div className="grid grid-cols-1 gap-md lg:grid-cols-3">
      <div className="space-y-md lg:col-span-2">
        <div className="grid grid-cols-1 gap-md sm:grid-cols-3">
          {REP_KPIS.map((kpi) => (
            <Card key={kpi.key} className="p-lg">
              <div className="mb-md flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary">
                  <Icon name={kpi.icon} size={20} />
                </span>
              </div>
              <p className="text-label-sm text-on-surface-variant">{tr(kpi.key)}</p>
              <h3 className="mt-1 font-display text-headline-md font-black text-on-surface">{kpi.value}</h3>
              <p className="mt-base flex items-center gap-1 text-body-sm">
                {kpi.change && <span className={cn('font-bold', kpi.tone === 'down' ? 'text-error' : 'text-green-600')}>{kpi.change}</span>}
                <span className="text-on-surface-variant">{tr(kpi.hintKey)}</span>
              </p>
            </Card>
          ))}
        </div>

        <Card className="border-2 border-dashed border-outline-variant/70 p-xl text-center">
          <span className="mx-auto mb-md flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon name="cloud_upload" size={28} />
          </span>
          <h2 className="font-display text-title-md font-bold text-on-surface">{tr('uploadTitle')}</h2>
          <p className="mx-auto mt-base max-w-md text-body-sm text-on-surface-variant">{tr('uploadSubtitle')}</p>
          <div className="mt-md flex flex-wrap justify-center gap-sm">
            <Button variant="primary">{tr('chooseFile')}</Button>
            <Button variant="secondary">{tr('linkMeet')}</Button>
          </div>
        </Card>

        <Card className="p-lg">
          <div className="mb-md flex items-center justify-between">
            <h2 className="font-display text-title-md font-bold text-on-surface">{tr('recentMeetings')}</h2>
            <button type="button" className="text-label-sm font-semibold text-primary hover:underline">{t('viewAll')}</button>
          </div>
          <table className="w-full text-start text-body-sm">
            <thead>
              <tr className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                <th className="pb-base text-start font-semibold">{tr('meetingName')}</th>
                <th className="pb-base text-start font-semibold">{tr('date')}</th>
                <th className="pb-base text-end font-semibold">{tr('status')}</th>
              </tr>
            </thead>
            <tbody>
              {REP_RECENT_MEETINGS.map((m) => (
                <tr key={m.title} className="border-t border-outline-variant/40">
                  <td className="py-md">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary"><Icon name={m.icon} size={18} /></span>
                      <div>
                        <p className="font-semibold text-on-surface">{m.title}</p>
                        <p className="text-on-surface-variant">{m.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-md text-on-surface-variant">{m.date}</td>
                  <td className="py-md text-end">
                    <Badge tone={m.status === 'closedWon' ? 'success' : 'info'}>{tr(m.status)}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div className="space-y-md">
        <Card className="bg-primary p-lg text-on-primary">
          <div className="mb-base flex items-center gap-2 text-label-sm uppercase tracking-wider">
            <Icon name="auto_awesome" size={18} /> {tr('aiSummary')}
          </div>
          <p className="text-label-sm font-bold uppercase tracking-wider text-on-primary/70">{tr('keyHighlight')}</p>
          <p className="mt-base text-body-sm text-on-primary/90">{tr('highlightBody')}</p>
          <div className="mt-md rounded-xl bg-white/10 p-md">
            <div className="flex items-center justify-between">
              <span className="text-label-sm text-on-primary/80">{tr('sentimentAnalysis')}</span>
              <span className="font-bold">84% {tr('positive')}</span>
            </div>
            <div className="mt-base h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white" style={{ width: '84%' }} />
            </div>
          </div>
          <p className="mt-md text-label-sm text-on-primary/70">{tr('keyTopics')}</p>
          <div className="mt-base flex flex-wrap gap-2">
            {REP_KEY_TOPICS.map((topic) => (
              <span key={topic} className="rounded-full bg-white/15 px-sm py-1 text-label-sm">{topic}</span>
            ))}
          </div>
          <Button variant="secondary" fullWidth className="mt-md bg-white/15 text-on-primary hover:bg-white/25">
            {tr('generateEmail')}
          </Button>
        </Card>

        <Card className="p-lg">
          <h2 className="mb-md font-display text-title-md font-bold text-on-surface">{tr('pipelineHealth')}</h2>
          <ul className="space-y-md">
            <li className="border-s-2 border-s-primary ps-md text-body-sm">{tr('pipelineNote1')}</li>
            <li className="border-s-2 border-s-secondary ps-md text-body-sm">{tr('pipelineNote2')}</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ----------------------------- Executive ----------------------------- */
function ExecutiveDashboard() {
  const te = useTranslations('dashboards.exec');
  return (
    <div className="space-y-lg">
      <div>
        <p className="text-label-sm font-bold uppercase tracking-wider text-primary">{te('console')}</p>
        <div className="mt-md grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-4">
          {EXEC_KPIS.map((kpi) => (
            <Card key={kpi.key} className="p-lg">
              <div className="mb-md flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary"><Icon name={kpi.icon} size={20} /></span>
                <span className={cn('rounded-full px-sm py-0.5 text-label-sm font-bold', toneClass(kpi.tone))}>{kpi.change}</span>
              </div>
              <p className="text-label-sm text-on-surface-variant">{te(kpi.key)}</p>
              <h3 className="mt-1 font-display text-headline-md font-black text-on-surface">{kpi.value}</h3>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-md lg:grid-cols-3">
        <Card className="p-lg lg:col-span-2">
          <h2 className="mb-md font-display text-title-md font-bold text-on-surface">{te('revenueForecast')}</h2>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <AreaChart data={EXEC_REVENUE} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="execGross" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4648d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4648d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#767586" fontSize={11} tickLine={false} />
                <YAxis stroke="#767586" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="gross" name={te('actual')} stroke="#4648d4" strokeWidth={3} fill="url(#execGross)" />
                <Area type="monotone" dataKey="forecast" name={te('forecast')} stroke="#6b38d4" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-primary p-lg text-on-primary">
          <div className="mb-base flex items-center gap-2 text-label-sm uppercase tracking-wider">
            <Icon name="auto_awesome" size={18} /> {te('aiForecast')}
          </div>
          <p className="text-body-md leading-relaxed text-on-primary/90">{te('forecastBody')}</p>
          <Button variant="secondary" fullWidth className="mt-md bg-white/15 text-on-primary hover:bg-white/25">{te('generatePlan')}</Button>
        </Card>
      </div>

      <Card className="p-lg">
        <h2 className="mb-md font-display text-title-md font-bold text-on-surface">{te('topSources')}</h2>
        <ul className="space-y-md">
          {EXEC_TOP_SOURCES.map((s) => (
            <li key={s.rank} className="flex items-center gap-md">
              <span className="text-label-sm font-bold text-on-surface-variant">{s.rank}</span>
              <Initials name={s.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-on-surface">{s.name}</p>
                <p className="text-body-sm text-on-surface-variant">{s.role}</p>
              </div>
              <span className="font-display text-title-md font-black text-primary">{s.score}<span className="text-body-sm text-on-surface-variant">/100</span></span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
