/**
 * Local presentation data for the bespoke role dashboards. These mirror the
 * design mockups (manager console, rep workspace, executive overview). Sample
 * names/accounts are illustrative data, not translated strings.
 */

export const MANAGER_KPIS = [
  { key: 'totalRevenue', value: '$4,281,000', change: '+12.4%', tone: 'up' as const, icon: 'payments' },
  { key: 'winRate', value: '28.4%', change: '+2.1%', tone: 'up' as const, icon: 'emoji_events' },
  { key: 'conversionRate', value: '42.1%', change: '-0.8%', tone: 'down' as const, icon: 'sync_alt' },
  { key: 'activeLeads', value: '1,240', change: '', tone: 'feature' as const, icon: 'trending_up' },
];

export const SALES_PERFORMANCE = [
  { name: 'Mon', value: 62, benchmark: 70 },
  { name: 'Tue', value: 78, benchmark: 70 },
  { name: 'Wed', value: 71, benchmark: 75 },
  { name: 'Thu', value: 84, benchmark: 78 },
  { name: 'Fri', value: 92, benchmark: 80 },
];

export const DEAL_DISTRIBUTION = [
  { key: 'discovery', value: 42, fill: '#4648d4' },
  { key: 'negotiation', value: 35, fill: '#8455ef' },
  { key: 'proposal', value: 23, fill: '#00628d' },
];
export const DEAL_DISTRIBUTION_TOTAL = 84;

export const TOP_PERFORMERS = [
  { rank: 1, name: 'Sarah Jenkins', amount: '$1.2M', goal: 104 },
  { rank: 2, name: 'Marcus Chen', amount: '$984K', goal: 92 },
  { rank: 3, name: 'David Miller', amount: '$852K', goal: 88 },
  { rank: 4, name: 'Elena Rodriguez', amount: '$740K', goal: 76 },
];

export const CRITICAL_ALERTS = [
  { account: 'Global Logistics Inc.', deal: 'Enterprise Expansion', issue: 'atRisk' as const, value: '$240,000', owner: 'David M.' },
  { account: 'Acme Corp', deal: 'Cloud Migration', issue: 'stuck' as const, value: '$115,000', owner: 'Sarah J.' },
  { account: 'Stellar Soft', deal: 'Annual Renewal', issue: 'noActivity' as const, value: '$42,000', owner: 'Marcus C.' },
];

export const REP_KPIS = [
  { key: 'totalInteractions', value: '1,284', change: '+12%', tone: 'up' as const, icon: 'bar_chart', hintKey: 'fromLastMonth' },
  { key: 'processedMeetings', value: '452', change: '', tone: 'flat' as const, icon: 'verified', hintKey: 'thisWeek' },
  { key: 'activePipeline', value: '$2.4M', change: '-4%', tone: 'down' as const, icon: 'account_balance_wallet', hintKey: 'quarterlyAdj' },
];

export const REP_RECENT_MEETINGS = [
  { title: 'Enterprise Onboarding: Acme Corp', subtitle: 'Strategy Sync', date: 'Oct 24, 2:00 PM', participants: 4, status: 'highIntent' as const, icon: 'videocam' },
  { title: 'Discovery Call: Global Tech', subtitle: 'Lead Qualifying', date: 'Oct 23, 11:30 AM', participants: 2, status: 'closedWon' as const, icon: 'mic' },
];

export const REP_KEY_TOPICS = ['System Migrations', 'Security Compliance', 'Cost Reduction', 'SLA Agreements'];

export const EXEC_KPIS = [
  { key: 'acv', value: '$4.2M', change: '+24%', tone: 'up' as const, icon: 'storefront' },
  { key: 'globalPipeline', value: '$12.8M', change: '+15%', tone: 'up' as const, icon: 'travel_explore' },
  { key: 'execWinRate', value: '34%', change: '+2%', tone: 'up' as const, icon: 'star' },
  { key: 'exposure', value: '72%', change: '-6%', tone: 'down' as const, icon: 'gavel' },
];

export const EXEC_REVENUE = [
  { name: 'Jan', gross: 1_200_000, forecast: 1_180_000 },
  { name: 'Feb', gross: 1_320_000, forecast: 1_300_000 },
  { name: 'Mar', gross: 1_500_000, forecast: 1_470_000 },
  { name: 'Apr', gross: 1_720_000, forecast: 1_700_000 },
  { name: 'May', gross: 2_050_000, forecast: 2_030_000 },
  { name: 'Jun', gross: 2_480_000, forecast: 2_650_000 },
];

export const EXEC_TOP_SOURCES = [
  { rank: 1, name: 'Sarah Ahmed', role: 'Senior Account Mgr', score: 98 },
  { rank: 2, name: 'Khalid Mansour', role: 'Sales Specialist', score: 85 },
  { rank: 3, name: 'Layla Youssef', role: 'Business Dev', score: 79 },
  { rank: 4, name: 'Omar Fawzy', role: 'Account Manager', score: 72 },
];
