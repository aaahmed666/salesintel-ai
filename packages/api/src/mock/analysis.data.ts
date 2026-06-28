import type {
  MeetingAnalysis,
  MeetingDeepDive,
  MeetingDetail,
  MeetingRep,
  SentimentPoint,
} from '@salesintel/types';

/* --------------------------------- Reps ---------------------------------- */

const reps = {
  david: { id: 'rep_david', name: 'David Chen' },
  sarah: { id: 'rep_sarah', name: 'Sarah Miller' },
  robert: { id: 'rep_robert', name: 'Robert Blake' },
  elena: { id: 'rep_elena', name: 'Elena Rodriguez' },
  amir: { id: 'rep_amir', name: 'Amir Hassan' },
  lena: { id: 'rep_lena', name: 'Lena Fischer' },
} satisfies Record<string, MeetingRep>;

/* ----------------------- Directory listing rows -------------------------- */

/**
 * Seed of analyzed meetings backing the Analysis Directory table. Mirrors the
 * design's sample rows, then padded out so pagination/sorting/filtering are
 * exercisable end-to-end against the mock.
 */
export const mockAnalyses: MeetingAnalysis[] = [
  {
    id: 'ma_1',
    title: 'Q4 Expansion Strategy',
    company: 'Global Logistics Corp',
    rep: reps.david,
    date: '2023-10-24T10:30:00.000Z',
    durationMinutes: 42,
    status: 'completed',
    score: 92,
    sentiment: 'very_positive',
    insights: ['High Intent', 'Decision Maker Present'],
    dealValue: 240000,
  },
  {
    id: 'ma_2',
    title: 'Initial Discovery Call',
    company: 'Apex Systems Ltd',
    rep: reps.sarah,
    date: '2023-10-23T14:00:00.000Z',
    durationMinutes: 28,
    status: 'completed',
    score: 54,
    sentiment: 'neutral',
    insights: ['Competitor Mentioned'],
    dealValue: 45000,
  },
  {
    id: 'ma_3',
    title: 'Pricing Objection Follow-up',
    company: 'Innova Tech',
    rep: reps.robert,
    date: '2023-10-23T09:15:00.000Z',
    durationMinutes: 35,
    status: 'completed',
    score: 38,
    sentiment: 'critical',
    insights: ['Budget Risks', 'Technical Blockers'],
    dealValue: 112500,
  },
  {
    id: 'ma_4',
    title: 'Contract Review',
    company: 'Stellar Blue Inc',
    rep: reps.elena,
    date: '2023-10-22T16:45:00.000Z',
    durationMinutes: 51,
    status: 'completed',
    score: 98,
    sentiment: 'very_positive',
    insights: ['Ready to Sign'],
    dealValue: 320000,
  },
  {
    id: 'ma_5',
    title: 'Quarterly Business Review',
    company: 'Northwind Traders',
    rep: reps.amir,
    date: '2023-10-21T11:00:00.000Z',
    durationMinutes: 47,
    status: 'completed',
    score: 81,
    sentiment: 'positive',
    insights: ['Upsell Opportunity'],
    dealValue: 175000,
  },
  {
    id: 'ma_6',
    title: 'Technical Deep Dive',
    company: 'Quantum Dynamics',
    rep: reps.lena,
    date: '2023-10-20T13:30:00.000Z',
    durationMinutes: 63,
    status: 'analyzing',
    insights: ['Technical Blockers'],
    dealValue: 90000,
  },
  {
    id: 'ma_7',
    title: 'Renewal Negotiation',
    company: 'Vertex Industries',
    rep: reps.david,
    date: '2023-10-19T15:00:00.000Z',
    durationMinutes: 39,
    status: 'completed',
    score: 73,
    sentiment: 'positive',
    insights: ['Renewal Risk', 'Champion Engaged'],
    dealValue: 210000,
  },
  {
    id: 'ma_8',
    title: 'Onboarding Kickoff',
    company: 'Pioneer Labs',
    rep: reps.sarah,
    date: '2023-10-18T10:00:00.000Z',
    durationMinutes: 30,
    status: 'completed',
    score: 88,
    sentiment: 'very_positive',
    insights: ['High Intent'],
    dealValue: 60000,
  },
  {
    id: 'ma_9',
    title: 'Competitive Displacement',
    company: 'Helix Software',
    rep: reps.robert,
    date: '2023-10-17T09:45:00.000Z',
    durationMinutes: 44,
    status: 'completed',
    score: 49,
    sentiment: 'critical',
    insights: ['Competitor Mentioned', 'Budget Risks'],
    dealValue: 135000,
  },
  {
    id: 'ma_10',
    title: 'Executive Alignment',
    company: 'Meridian Group',
    rep: reps.elena,
    date: '2023-10-16T14:30:00.000Z',
    durationMinutes: 55,
    status: 'completed',
    score: 84,
    sentiment: 'positive',
    insights: ['Decision Maker Present'],
    dealValue: 295000,
  },
  {
    id: 'ma_11',
    title: 'Security & Compliance Q&A',
    company: 'Fortress Financial',
    rep: reps.amir,
    date: '2023-10-15T11:15:00.000Z',
    durationMinutes: 41,
    status: 'transcribing',
    insights: ['Compliance Review'],
    dealValue: 410000,
  },
  {
    id: 'ma_12',
    title: 'Pilot Wrap-up',
    company: 'Brightwave Media',
    rep: reps.lena,
    date: '2023-10-14T16:00:00.000Z',
    durationMinutes: 33,
    status: 'failed',
    insights: [],
    dealValue: 70000,
  },
];

/* ---------------------- Detail payload generation ------------------------ */

function timeline(seed: number): SentimentPoint[] {
  const base = [0.3, 0.45, 0.55, -0.4, 0.2, 0.5, 0.65, 0.4, 0.7, 0.55, 0.6, 0.8];
  return base.map((v, i) => ({
    timestamp: i * 240,
    value: Number((v + Math.sin(seed + i) * 0.05).toFixed(2)),
  }));
}

/**
 * Build a full {@link MeetingDetail} from a directory row. The narrative blocks
 * are templated from the row so every meeting opens to a coherent details view
 * without hand-authoring twelve payloads.
 */
export function buildDetail(row: MeetingAnalysis): MeetingDetail {
  const seed = row.id.length;
  return {
    ...row,
    recordingAvailable: row.status !== 'failed',
    summary:
      `The meeting with ${row.company} centered on their multi-region requirements. ` +
      `The client expressed interest in data residency compliance and scalability for the ` +
      `target market. Sentiment remained largely ${row.sentiment ?? 'neutral'}, though slight ` +
      `friction was detected regarding implementation timelines during the discussion.`,
    summaryTags: ['#expansion', '#compliance', '#technical-debt'],
    propensityLabel: (row.score ?? 0) >= 70 ? 'High Propensity' : 'Needs Nurturing',
    participants: [
      {
        id: `${row.id}_p1`,
        name: 'John Doe',
        title: 'CTO, Decision Maker',
        side: 'external',
        role: 'decision_maker',
      },
      {
        id: `${row.id}_p2`,
        name: 'Emily Chen',
        title: 'Legal Counsel, Blocker',
        side: 'external',
        role: 'blocker',
      },
      {
        id: `${row.id}_p3`,
        name: row.rep.name,
        title: 'Account Executive',
        side: 'internal',
        role: 'host',
      },
      {
        id: `${row.id}_p4`,
        name: 'Sarah Adams',
        title: 'Solutions Engineer',
        side: 'internal',
        role: 'participant',
      },
    ],
    sentimentTimeline: timeline(seed),
    competitors: [
      {
        id: `${row.id}_c1`,
        name: 'Salesforce',
        mentions: 2,
        context: 'Mentioned regarding "Integration Speed". Client feels our workflow is cleaner.',
        favorable: true,
      },
      {
        id: `${row.id}_c2`,
        name: 'HubSpot',
        mentions: 1,
        context: 'Mentioned regarding "Simplicity". Comparison was favorable for our UI.',
        favorable: true,
      },
    ],
    highlights: [
      {
        id: `${row.id}_h1`,
        label: 'Data Residency Compliance',
        tone: 'positive',
        detail: 'Client confirmed EU data residency is a gating requirement we already satisfy.',
      },
      {
        id: `${row.id}_h2`,
        label: 'Implementation Timeline',
        tone: 'risk',
        detail: 'Friction detected around Q2 deployment timeline; needs an executive commitment.',
      },
    ],
    nextSteps: [
      { id: `${row.id}_n1`, label: 'Send GDPR technical whitepaper', done: true },
      { id: `${row.id}_n2`, label: 'Draft EMEA deployment timeline', done: false },
      { id: `${row.id}_n3`, label: 'Schedule technical deep-dive', done: false },
    ],
    transcript: [
      {
        id: `${row.id}_t1`,
        speaker: `John Doe (${row.company})`,
        role: 'Client Lead @ ' + row.company,
        isSelf: false,
        timestamp: 12,
        text:
          "So when looking at the Q4 roadmap, I noticed there's a heavy emphasis on AI " +
          'integration. While that is great, our procurement team is currently pushing back ' +
          'on the seat-based pricing model. We have been looking at Competitor X recently and ' +
          'they seem to have a more flexible enterprise-wide license.',
        keywords: ['AI integration', 'seat-based pricing', 'Competitor X', 'enterprise-wide license'],
        tags: ['Competitor Mention', 'Pricing'],
        highlight: {
          id: `${row.id}_hl1`,
          kind: 'objection',
          titleKey: 'objectionPricing',
          title: 'Pricing Objection Detected',
          detail: 'Prospect is comparing seat-based models with enterprise licenses from competitors.',
        },
      },
      {
        id: `${row.id}_t2`,
        speaker: `${row.rep.name} (Me)`,
        role: 'Account Executive',
        isSelf: true,
        timestamp: 48,
        text:
          'I hear you, John. We actually have an enterprise tier that bypasses seat counts if ' +
          "you hit a specific volume threshold. I'd love to show you how our 'Intelligence " +
          "Pack' actually reduces the total cost of ownership compared to Competitor X's basic package.",
        keywords: ['enterprise tier', 'total cost of ownership', 'Intelligence Pack'],
        highlight: {
          id: `${row.id}_hl2`,
          kind: 'upsell',
          titleKey: 'upsellOpportunity',
          title: 'Upsell Opportunity',
          detail:
            'Rep successfully redirected to TCO value prop. AI suggests mentioning the Security Add-on next.',
        },
      },
      {
        id: `${row.id}_t3`,
        speaker: `John Doe (${row.company})`,
        role: 'Client Lead @ ' + row.company,
        isSelf: false,
        timestamp: 95,
        text:
          'That sounds promising. If we can get that security certification by end of month, we ' +
          'could probably move the signature forward to next week. We are very keen on the ' +
          'predictive analytics engine.',
        keywords: ['security certification', 'predictive analytics', 'next week'],
        tags: ['Buying Signal'],
        highlight: {
          id: `${row.id}_hl3`,
          kind: 'buying-signal',
          titleKey: 'buyingIntentSignal',
          title: 'Buying Intent Signal',
          detail: "Timeline mentioned: 'Next week'. Key pain point solved: 'Predictive Analytics'.",
        },
      },
      {
        id: `${row.id}_t4`,
        speaker: `${row.rep.name} (Me)`,
        role: 'Account Executive',
        isSelf: true,
        timestamp: 142,
        text:
          'Perfect. I will fast-track the SOC 2 documentation to our compliance team today and ' +
          'send over a redlined enterprise agreement so legal can start their review in parallel.',
        keywords: ['SOC 2', 'enterprise agreement'],
      },
    ],
    crmProvider: 'SFDC',
    urgency: 'high',
    transcriptInsights: {
      buyingIntent: {
        score: 84,
        signals: [
          { id: `${row.id}_bs1`, label: 'Timeline confirmed (Next Week)', met: true },
          { id: `${row.id}_bs2`, label: 'Budget Authority present', met: true },
          { id: `${row.id}_bs3`, label: 'Security review outstanding', met: false },
        ],
      },
      competitors: [
        { id: `${row.id}_tc1`, name: 'Competitor X', threatLevel: 'threat' },
        { id: `${row.id}_tc2`, name: 'SalesNow', threatLevel: 'neutral' },
      ],
      keywords: [
        { id: `${row.id}_kw1`, label: 'Security Cert', emphasis: true },
        { id: `${row.id}_kw2`, label: 'Pricing Model', emphasis: false },
        { id: `${row.id}_kw3`, label: 'AI Roadmap', emphasis: true },
        { id: `${row.id}_kw4`, label: 'Procurement', emphasis: false },
        { id: `${row.id}_kw5`, label: 'Scalability', emphasis: false },
        { id: `${row.id}_kw6`, label: 'TCO Reduction', emphasis: true },
      ],
      aiConfidence: 92,
    },
  };
}

/* ----------------------- AI Analysis Deep Dive --------------------------- */

/**
 * Builds the deep-dive payload from a directory row, reusing the same detail
 * data (sentiment timeline, competitors) and layering the six analysis
 * sections on top. Deterministic so screenshots/tests stay stable.
 */
export function buildDeepDive(row: MeetingAnalysis): MeetingDeepDive {
  const detail = buildDetail(row);
  const score = row.score ?? 70;

  return {
    id: row.id,
    title: row.title,
    company: row.company,
    date: row.date,
    closeWonProbability: Math.min(99, Math.max(35, score + 8)),
    dealHealthScore: score,

    sentiment: {
      overall: row.sentiment ?? 'neutral',
      summary:
        'Conversation opened cautiously around pricing, then warmed sharply once the ' +
        'enterprise tier and TCO story landed. A late friction spike maps to the security ' +
        'review ask.',
      breakdown: { positive: 58, neutral: 27, negative: 15 },
      timeline: detail.sentimentTimeline,
      talkRatio: { self: 42, prospect: 58 },
      qualityScore: 75,
    },

    competitors: detail.competitors,
    competitorSummary:
      'Two competitors surfaced. Competitor X is the active threat (flexible enterprise ' +
      'licensing); HubSpot was mentioned favorably on UI only.',

    industry: {
      sector: 'B2B SaaS · Sales Technology',
      summary:
        'Deal sits in the upper quartile for deal size in this sector. Sales cycle is ' +
        'tracking faster than the segment median, driven by an executive champion.',
      benchmarks: [
        { id: `${row.id}_ib1`, label: 'Deal size vs sector', value: 185, benchmark: 120, unit: 'k$' },
        { id: `${row.id}_ib2`, label: 'Sales cycle', value: 34, benchmark: 52, unit: 'd' },
        { id: `${row.id}_ib3`, label: 'Stakeholders engaged', value: 5, benchmark: 3, unit: '' },
        { id: `${row.id}_ib4`, label: 'Discovery depth', value: 78, benchmark: 65, unit: '%' },
      ],
      trends: [
        'AI-driven lead scoring is now a top-3 buying criterion in this segment.',
        'Procurement increasingly pushes for enterprise-wide licensing over per-seat.',
        'Data residency / SOC 2 raised in ~70% of comparable enterprise deals.',
      ],
    },

    keywords: [
      { id: `${row.id}_kf1`, label: 'Pricing', count: 14, category: 'pricing' },
      { id: `${row.id}_kf2`, label: 'Integration', count: 11, category: 'product' },
      { id: `${row.id}_kf3`, label: 'Competitor X', count: 8, category: 'competitor' },
      { id: `${row.id}_kf4`, label: 'Security', count: 7, category: 'risk' },
      { id: `${row.id}_kf5`, label: 'Timeline', count: 6, category: 'process' },
      { id: `${row.id}_kf6`, label: 'Predictive Analytics', count: 5, category: 'product' },
      { id: `${row.id}_kf7`, label: 'Procurement', count: 4, category: 'process' },
      { id: `${row.id}_kf8`, label: 'Migration', count: 3, category: 'risk' },
    ],
    keywordSummary:
      'Pricing and integration dominate the conversation; risk themes (security, ' +
      'migration) cluster in the back half and warrant proactive follow-up.',

    buyingSignals: {
      score: 84,
      summary:
        'Strong intent. Timeline and budget authority are both confirmed; only the ' +
        'security review is outstanding before signature.',
      signals: [
        {
          id: `${row.id}_bsd1`,
          label: 'Explicit timeline ("next week")',
          strength: 92,
          category: 'timeline',
          evidence: 'Prospect offered to move the signature forward to next week.',
        },
        {
          id: `${row.id}_bsd2`,
          label: 'Budget authority present',
          strength: 80,
          category: 'budget',
          evidence: 'Procurement is engaged and negotiating license structure.',
        },
        {
          id: `${row.id}_bsd3`,
          label: 'Decision maker on call',
          strength: 74,
          category: 'authority',
          evidence: 'Client Lead framed the Q4 roadmap decision directly.',
        },
        {
          id: `${row.id}_bsd4`,
          label: 'Clear pain → solution fit',
          strength: 68,
          category: 'need',
          evidence: 'Predictive analytics named as the key pain point being solved.',
        },
      ],
    },

    objections: [
      {
        id: `${row.id}_ob1`,
        title: 'Seat-based pricing model',
        quote: 'Our procurement team is currently pushing back on the seat-based pricing model.',
        severity: 'high',
        status: 'addressed',
        recommendation: 'Lead with the enterprise tier + TCO comparison; send the pricing one-pager.',
      },
      {
        id: `${row.id}_ob2`,
        title: 'Security certification timing',
        quote: 'If we can get that security certification by end of month...',
        severity: 'medium',
        status: 'open',
        recommendation: 'Fast-track SOC 2 documentation and share the compliance timeline today.',
      },
      {
        id: `${row.id}_ob3`,
        title: 'Data migration risk',
        quote: 'My main concern is the data migration from HubSpot.',
        severity: 'medium',
        status: 'open',
        recommendation: 'Offer a guided migration plan and a named implementation contact.',
      },
    ],
    objectionSummary:
      'Three objections detected. The pricing objection was handled well in-call; security ' +
      'and migration remain open and are the critical path to signature.',

    recommendations: [
      {
        id: `${row.id}_rec1`,
        title: 'Send Migration Whitepaper',
        detail: "Address the prospect's concern about HubSpot data migration security.",
        actionLabel: 'Generate Email',
        tone: 'risk',
      },
      {
        id: `${row.id}_rec2`,
        title: 'Share enterprise pricing one-pager',
        detail: 'Reinforce the TCO advantage over Competitor X while it is top of mind.',
        actionLabel: 'Open template',
        tone: 'neutral',
      },
      {
        id: `${row.id}_rec3`,
        title: 'Confirm signature for next week',
        detail: 'Buying intent is high — propose a concrete signing date to lock momentum.',
        actionLabel: 'Draft follow-up',
        tone: 'positive',
      },
    ],
  };
}
