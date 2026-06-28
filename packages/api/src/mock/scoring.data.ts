import type {
  SalesScore,
  ScoringMetric,
  CoachingRecommendation,
  TalkRatioBreakdown,
  ScoreTrendPoint,
  SalesGrade,
} from '@salesintel/types';

/* ─── helpers ─── */

function gradeFromScore(score: number): SalesGrade {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  return 'D';
}

/* ─── static metrics ─── */

const MOCK_METRICS: ScoringMetric[] = [
  {
    key: 'talkRatio',
    label: 'Talk Ratio',
    score: 82,
    benchmark: 75,
    grade: 'A',
    description:
      'Measured the balance of speaking time between you and the prospect. Optimal range is 40-60% rep talk time.',
    strengths: [
      'Maintained healthy 42/58 talk ratio',
      'Let the prospect speak uninterrupted during discovery',
      'Good use of strategic pauses',
    ],
    improvements: [
      'Slightly reduce talk time during objection handling phase',
      'Ask more open-ended questions to encourage prospect elaboration',
    ],
  },
  {
    key: 'discovery',
    label: 'Discovery',
    score: 78,
    benchmark: 70,
    grade: 'B',
    description:
      'Evaluated the depth and quality of discovery questions asked to uncover prospect needs, pain points, and buying criteria.',
    strengths: [
      'Asked 8 targeted discovery questions',
      'Successfully identified primary pain point (manual lead distribution)',
      'Good probing into timeline requirements',
    ],
    improvements: [
      'Dig deeper into budget and decision-making process',
      'Explore competitive landscape earlier in conversation',
      'Ask about success metrics and KPIs',
    ],
  },
  {
    key: 'objectionHandling',
    label: 'Objection Handling',
    score: 65,
    benchmark: 72,
    grade: 'C',
    description:
      'Assessed how effectively objections were identified, acknowledged, and resolved during the conversation.',
    strengths: [
      'Acknowledged the migration concern empathetically',
      'Provided specific feature examples to counter timeline objection',
    ],
    improvements: [
      'Address data migration fears more proactively with case studies',
      'Use the "feel, felt, found" framework for complex objections',
      'Prepare competitive displacement talk track for HubSpot mentions',
    ],
  },
  {
    key: 'commitment',
    label: 'Commitment',
    score: 88,
    benchmark: 68,
    grade: 'A',
    description:
      'Measured micro-commitments and buy-in signals obtained throughout the conversation.',
    strengths: [
      'Secured agreement on implementation timeline',
      'Got verbal commitment to involve VP of Sales in next meeting',
      'Successfully advanced the deal stage',
    ],
    improvements: [
      'Ask for more specific commitment on evaluation criteria',
      'Confirm budget alignment before advancing',
    ],
  },
  {
    key: 'nextSteps',
    label: 'Next Steps',
    score: 91,
    benchmark: 65,
    grade: 'A+',
    description:
      'Evaluated whether clear, actionable, and time-bound next steps were established at the end of the conversation.',
    strengths: [
      'Set specific follow-up date (within 48 hours)',
      'Assigned clear action items to both parties',
      'Confirmed next meeting with decision-maker present',
      'Sent calendar invite during the call',
    ],
    improvements: ['Document mutual action plan in a shared workspace'],
  },
];

/* ─── coaching recommendations ─── */

const MOCK_COACHING: CoachingRecommendation[] = [
  {
    id: 'coach_1',
    title: 'Strengthen Objection Handling with Case Studies',
    detail:
      'Your objection handling score is below benchmark. When prospects raise migration concerns, use the "similar customer" framework with specific case studies showing successful transitions.',
    metricKey: 'objectionHandling',
    priority: 'high',
    steps: [
      'Prepare 3 relevant migration success stories from similar-sized companies',
      'Create a one-pager addressing the top 5 HubSpot migration concerns',
      'Practice the "feel, felt, found" response framework',
      'Schedule a role-play session with your team lead',
    ],
    estimatedImpact: '+15% objection handling score improvement',
  },
  {
    id: 'coach_2',
    title: 'Deepen Discovery with MEDDPICC Framework',
    detail:
      'While your discovery is solid, applying the MEDDPICC framework will help you systematically uncover the Metrics, Economic Buyer, Decision Criteria, and Pain points earlier in the conversation.',
    metricKey: 'discovery',
    priority: 'medium',
    steps: [
      'Review MEDDPICC checklist before each discovery call',
      'Prepare 3 questions for each MEDDPICC category',
      'Focus on identifying the economic buyer earlier',
      'Document identified criteria in CRM after each call',
    ],
    estimatedImpact: '+10% discovery score improvement',
  },
  {
    id: 'coach_3',
    title: 'Maintain Your Excellent Next Steps Discipline',
    detail:
      'Your next steps score is exceptional (A+). Continue using the mutual action plan approach and calendar blocking during calls to maintain this advantage.',
    metricKey: 'nextSteps',
    priority: 'low',
    steps: [
      'Continue sending recap emails within 2 hours',
      'Share this approach with teammates in the next team meeting',
      'Consider adding a shared project tracker for complex deals',
    ],
    estimatedImpact: 'Sustain A+ grade and help team adoption',
  },
  {
    id: 'coach_4',
    title: 'Optimize Talk Ratio During Objections',
    detail:
      'Your overall talk ratio is healthy, but during the objection handling phase you spoke 68% of the time. Listen more during objections to fully understand concerns before responding.',
    metricKey: 'talkRatio',
    priority: 'medium',
    steps: [
      'Use the "3-second pause" technique before responding to objections',
      'Ask clarifying questions instead of immediately providing solutions',
      'Summarize the objection back to the prospect before addressing it',
    ],
    estimatedImpact: '+8% talk ratio score in objection segments',
  },
  {
    id: 'coach_5',
    title: 'Build Stronger Commitment Through Value Anchoring',
    detail:
      'Your commitment score is strong but you can make it exceptional by anchoring each commitment to specific value outcomes the prospect has articulated.',
    metricKey: 'commitment',
    priority: 'low',
    steps: [
      'Reference the prospect\'s stated goals when asking for commitments',
      'Use trial closes tied to ROI projections',
      'Build a value summary slide for the next presentation',
    ],
    estimatedImpact: '+5% commitment score improvement',
  },
];

/* ─── talk ratio breakdown ─── */

const MOCK_TALK_RATIO: TalkRatioBreakdown = {
  selfPercent: 42,
  prospectPercent: 48,
  silencePercent: 10,
  idealSelfRange: [35, 55],
};

/* ─── score trend ─── */

const MOCK_TREND: ScoreTrendPoint[] = [
  { date: '2023-09-15T00:00:00.000Z', score: 68 },
  { date: '2023-09-22T00:00:00.000Z', score: 72 },
  { date: '2023-10-01T00:00:00.000Z', score: 71 },
  { date: '2023-10-08T00:00:00.000Z', score: 76 },
  { date: '2023-10-15T00:00:00.000Z', score: 79 },
  { date: '2023-10-20T00:00:00.000Z', score: 81 },
  { date: '2023-10-24T00:00:00.000Z', score: 82 },
];

/* ─── builder ─── */

/** Build a complete SalesScore payload from a meeting id. */
export function buildSalesScore(meetingId: string): SalesScore {
  const overallScore = Math.round(
    MOCK_METRICS.reduce((sum, m) => sum + m.score, 0) / MOCK_METRICS.length,
  );

  return {
    id: `score_${meetingId}`,
    meetingId,
    meetingTitle: 'Q4 Expansion Strategy: Acme Corp x SalesForce',
    repName: 'Alex Johnson',
    date: '2023-10-24T14:00:00.000Z',
    overallScore,
    overallGrade: gradeFromScore(overallScore),
    previousScore: 76,
    metrics: MOCK_METRICS.map((m) => ({ ...m })),
    talkRatioBreakdown: { ...MOCK_TALK_RATIO },
    coachingRecommendations: MOCK_COACHING.map((c) => ({ ...c, steps: [...c.steps] })),
    scoreTrend: MOCK_TREND.map((t) => ({ ...t })),
  };
}
