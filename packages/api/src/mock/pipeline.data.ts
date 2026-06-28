import type {
  Deal,
  PipelineStage,
  DealTemperature,
  PipelineKPIs,
  StageMetric,
  PipelineData,
  PipelineFilters,
} from '@salesintel/types';

/* ─── Mock Reps ─── */

const REPS = [
  { id: 'rep_1', name: 'Alex Johnson', initials: 'AJ' },
  { id: 'rep_2', name: 'Sarah Chen', initials: 'SC' },
  { id: 'rep_3', name: 'Marcus Williams', initials: 'MW' },
  { id: 'rep_4', name: 'Emily Rodriguez', initials: 'ER' },
  { id: 'rep_5', name: 'David Kim', initials: 'DK' },
] as const;

/* ─── Mock Deals ─── */

const MOCK_DEALS: Deal[] = [
  // ── Lead Stage ──
  {
    id: 'deal_1', company: 'Stellar Dynamics', title: 'Enterprise Expansion',
    value: 245000, stage: 'lead', temperature: 'warm', probability: 20,
    closeDate: '2024-01-15T00:00:00.000Z', rep: { ...REPS[0] },
    lastActivity: '3 days ago', lastActivityDate: '2024-10-21T10:00:00.000Z', lastActivityIcon: 'calendar_today',
  },
  {
    id: 'deal_2', company: 'Nebula Cloud', title: 'Cloud Migration',
    value: 82000, stage: 'lead', temperature: 'cold', probability: 10,
    closeDate: '2024-02-28T00:00:00.000Z', rep: { ...REPS[2] },
    lastActivity: 'Yesterday', lastActivityDate: '2024-10-23T14:30:00.000Z', lastActivityIcon: 'call',
  },
  {
    id: 'deal_3', company: 'Horizon Labs', title: 'R&D Platform License',
    value: 175000, stage: 'lead', temperature: 'warm', probability: 15,
    closeDate: '2024-02-10T00:00:00.000Z', rep: { ...REPS[1] },
    lastActivity: 'Demo scheduled', lastActivityDate: '2024-10-20T09:00:00.000Z', lastActivityIcon: 'event',
  },
  {
    id: 'deal_4', company: 'Vertex Solutions', title: 'Analytics Suite',
    value: 320000, stage: 'lead', temperature: 'hot', probability: 25,
    closeDate: '2024-01-30T00:00:00.000Z', rep: { ...REPS[3] },
    lastActivity: 'Inbound request', lastActivityDate: '2024-10-24T08:00:00.000Z', lastActivityIcon: 'inbox',
  },

  // ── Qualified Stage ──
  {
    id: 'deal_5', company: 'Prism Analytics', title: 'Data Platform',
    value: 560000, stage: 'qualified', temperature: 'hot', probability: 40,
    closeDate: '2024-01-10T00:00:00.000Z', rep: { ...REPS[1] },
    lastActivity: 'Today', lastActivityDate: '2024-10-24T11:00:00.000Z', lastActivityIcon: 'mail',
  },
  {
    id: 'deal_6', company: 'Catalyst Corp', title: 'Sales Automation',
    value: 290000, stage: 'qualified', temperature: 'warm', probability: 35,
    closeDate: '2024-02-05T00:00:00.000Z', rep: { ...REPS[4] },
    lastActivity: 'Follow-up sent', lastActivityDate: '2024-10-22T16:00:00.000Z', lastActivityIcon: 'send',
  },

  // ── Proposal Stage ──
  {
    id: 'deal_7', company: 'Apex Systems', title: 'Infrastructure Upgrade',
    value: 1100000, stage: 'proposal', temperature: 'hot', probability: 55,
    closeDate: '2024-12-20T00:00:00.000Z', rep: { ...REPS[0] },
    lastActivity: 'V2 Sent', lastActivityDate: '2024-10-23T09:00:00.000Z', lastActivityIcon: 'description',
  },
  {
    id: 'deal_8', company: 'Quantum Networks', title: 'Security Suite',
    value: 450000, stage: 'proposal', temperature: 'warm', probability: 50,
    closeDate: '2024-01-05T00:00:00.000Z', rep: { ...REPS[3] },
    lastActivity: 'Proposal reviewed', lastActivityDate: '2024-10-22T14:00:00.000Z', lastActivityIcon: 'visibility',
  },
  {
    id: 'deal_9', company: 'Zenith Digital', title: 'Marketing Platform',
    value: 380000, stage: 'proposal', temperature: 'hot', probability: 60,
    closeDate: '2024-12-15T00:00:00.000Z', rep: { ...REPS[2] },
    lastActivity: 'Counter-offer', lastActivityDate: '2024-10-24T10:00:00.000Z', lastActivityIcon: 'swap_horiz',
  },
  {
    id: 'deal_10', company: 'Omega Retail', title: 'POS Integration',
    value: 195000, stage: 'proposal', temperature: 'cold', probability: 30,
    closeDate: '2024-02-20T00:00:00.000Z', rep: { ...REPS[4] },
    lastActivity: 'Waiting on legal', lastActivityDate: '2024-10-19T11:00:00.000Z', lastActivityIcon: 'gavel',
  },
  {
    id: 'deal_11', company: 'Atlas Manufacturing', title: 'ERP Module',
    value: 520000, stage: 'proposal', temperature: 'warm', probability: 45,
    closeDate: '2024-01-25T00:00:00.000Z', rep: { ...REPS[1] },
    lastActivity: 'Technical review', lastActivityDate: '2024-10-21T15:00:00.000Z', lastActivityIcon: 'engineering',
  },

  // ── Negotiation Stage ──
  {
    id: 'deal_12', company: 'Global Logistics Inc', title: 'Fleet Management',
    value: 2850000, stage: 'negotiation', temperature: 'hot', probability: 75,
    closeDate: '2024-11-30T00:00:00.000Z', rep: { ...REPS[0] },
    lastActivity: 'Closing Next Week', lastActivityDate: '2024-10-24T09:00:00.000Z', lastActivityIcon: 'handshake',
  },
  {
    id: 'deal_13', company: 'Pinnacle Health', title: 'Patient Portal',
    value: 680000, stage: 'negotiation', temperature: 'warm', probability: 65,
    closeDate: '2024-12-10T00:00:00.000Z', rep: { ...REPS[3] },
    lastActivity: 'Contract review', lastActivityDate: '2024-10-23T16:00:00.000Z', lastActivityIcon: 'contract',
  },
  {
    id: 'deal_14', company: 'Summit Financial', title: 'Compliance Suite',
    value: 920000, stage: 'negotiation', temperature: 'hot', probability: 80,
    closeDate: '2024-11-20T00:00:00.000Z', rep: { ...REPS[2] },
    lastActivity: 'Awaiting Signature', lastActivityDate: '2024-10-24T12:00:00.000Z', lastActivityIcon: 'draw',
  },

  // ── Won Stage ──
  {
    id: 'deal_15', company: 'Titan Industries', title: 'Full Platform',
    value: 4200000, stage: 'won', temperature: 'hot', probability: 100,
    closeDate: '2024-10-15T00:00:00.000Z', rep: { ...REPS[0] },
    lastActivity: 'Closed', lastActivityDate: '2024-10-15T17:00:00.000Z', lastActivityIcon: 'check_circle',
  },
  {
    id: 'deal_16', company: 'Nova Energy', title: 'Smart Grid Analytics',
    value: 1850000, stage: 'won', temperature: 'hot', probability: 100,
    closeDate: '2024-10-10T00:00:00.000Z', rep: { ...REPS[1] },
    lastActivity: 'Closed', lastActivityDate: '2024-10-10T14:00:00.000Z', lastActivityIcon: 'check_circle',
  },
  {
    id: 'deal_17', company: 'Crest Biotech', title: 'Lab Management',
    value: 750000, stage: 'won', temperature: 'hot', probability: 100,
    closeDate: '2024-09-28T00:00:00.000Z', rep: { ...REPS[4] },
    lastActivity: 'Closed', lastActivityDate: '2024-09-28T11:00:00.000Z', lastActivityIcon: 'check_circle',
  },

  // ── Lost Stage ──
  {
    id: 'deal_18', company: 'Velocis Tech', title: 'DevOps Platform',
    value: 140000, stage: 'lost', temperature: 'cold', probability: 0,
    closeDate: '2024-10-01T00:00:00.000Z', rep: { ...REPS[2] },
    lastActivity: 'Competitor', lastActivityDate: '2024-10-01T10:00:00.000Z', lastActivityIcon: 'close',
  },
  {
    id: 'deal_19', company: 'Rift Media', title: 'Content Studio',
    value: 95000, stage: 'lost', temperature: 'cold', probability: 0,
    closeDate: '2024-09-20T00:00:00.000Z', rep: { ...REPS[3] },
    lastActivity: 'No budget', lastActivityDate: '2024-09-20T09:00:00.000Z', lastActivityIcon: 'close',
  },
  {
    id: 'deal_20', company: 'Cobalt Systems', title: 'IT Migration',
    value: 210000, stage: 'lost', temperature: 'cold', probability: 0,
    closeDate: '2024-09-15T00:00:00.000Z', rep: { ...REPS[4] },
    lastActivity: 'Timing', lastActivityDate: '2024-09-15T16:00:00.000Z', lastActivityIcon: 'close',
  },
];

/* ─── Computed helpers ─── */

const STAGE_ORDER: PipelineStage[] = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

function computeStageMetrics(deals: Deal[]): StageMetric[] {
  return STAGE_ORDER.map((stage) => {
    const stageDeals = deals.filter((d) => d.stage === stage);
    return {
      stage,
      dealCount: stageDeals.length,
      totalValue: stageDeals.reduce((sum, d) => sum + d.value, 0),
    };
  });
}

function computeKPIs(deals: Deal[]): PipelineKPIs {
  const active = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost');
  const won = deals.filter((d) => d.stage === 'won');
  const closed = deals.filter((d) => d.stage === 'won' || d.stage === 'lost');

  const totalValue = active.reduce((sum, d) => sum + d.value, 0);
  const weightedPipeline = active.reduce((sum, d) => sum + d.value * (d.probability / 100), 0);

  return {
    totalDeals: active.length,
    totalValue,
    avgDealSize: active.length > 0 ? Math.round(totalValue / active.length) : 0,
    winRate: closed.length > 0 ? Math.round((won.length / closed.length) * 100) : 0,
    avgCycleLength: 34,
    weightedPipeline: Math.round(weightedPipeline),
  };
}

function filterDeals(deals: Deal[], filters: PipelineFilters): Deal[] {
  let result = [...deals];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (d) =>
        d.company.toLowerCase().includes(q) ||
        d.title.toLowerCase().includes(q) ||
        d.rep.name.toLowerCase().includes(q),
    );
  }
  if (filters.stages && filters.stages.length > 0) {
    result = result.filter((d) => filters.stages!.includes(d.stage));
  }
  if (filters.temperatures && filters.temperatures.length > 0) {
    result = result.filter((d) => filters.temperatures!.includes(d.temperature));
  }
  if (filters.repIds && filters.repIds.length > 0) {
    result = result.filter((d) => filters.repIds!.includes(d.rep.id));
  }
  if (filters.minValue !== undefined) {
    result = result.filter((d) => d.value >= filters.minValue!);
  }
  if (filters.maxValue !== undefined) {
    result = result.filter((d) => d.value <= filters.maxValue!);
  }

  return result;
}

/** Build a complete PipelineData payload, optionally filtering deals. */
export function buildPipelineData(filters: PipelineFilters = {}): PipelineData {
  const filtered = filterDeals(MOCK_DEALS, filters);

  return {
    deals: filtered,
    kpis: computeKPIs(MOCK_DEALS),
    stageMetrics: computeStageMetrics(filtered),
    pipelineName: 'Q4 Global Enterprise',
    totalDeals: filtered.length,
  };
}

export { MOCK_DEALS };
