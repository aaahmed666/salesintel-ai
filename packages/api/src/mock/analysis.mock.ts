import type {
  MeetingAnalysis,
  MeetingDeepDive,
  MeetingDetail,
  MeetingListParams,
  Paginated,
} from '@salesintel/types';
import { DEFAULT_DIRECTORY_PAGE_SIZE } from '@salesintel/config';
import { delay } from './db';
import { buildDeepDive, buildDetail, mockAnalyses } from './analysis.data';

/** Session-scoped copy so future mutations (if added) persist within a session. */
const analyses: MeetingAnalysis[] = mockAnalyses.map((m) => ({ ...m }));

function matchesSearch(row: MeetingAnalysis, search: string): boolean {
  const q = search.trim().toLowerCase();
  if (!q) return true;
  return (
    row.title.toLowerCase().includes(q) ||
    row.company.toLowerCase().includes(q) ||
    row.rep.name.toLowerCase().includes(q)
  );
}

function compare(
  a: MeetingAnalysis,
  b: MeetingAnalysis,
  field: NonNullable<MeetingListParams['sortBy']>,
): number {
  switch (field) {
    case 'title':
      return a.title.localeCompare(b.title);
    case 'company':
      return a.company.localeCompare(b.company);
    case 'rep':
      return a.rep.name.localeCompare(b.rep.name);
    case 'date':
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    case 'durationMinutes':
      return a.durationMinutes - b.durationMinutes;
    case 'status':
      return a.status.localeCompare(b.status);
    case 'score':
      return (a.score ?? -1) - (b.score ?? -1);
    default:
      return 0;
  }
}

export const mockAnalysisApi = {
  /** Server-shaped list endpoint with search, filter, sort and pagination. */
  async listAnalyses(params: MeetingListParams = {}): Promise<Paginated<MeetingAnalysis>> {
    await delay(500);

    const {
      search = '',
      status = 'all',
      sentiment = 'all',
      sortBy = 'date',
      sortDir = 'desc',
      page = 1,
      pageSize = DEFAULT_DIRECTORY_PAGE_SIZE,
    } = params;

    let rows = analyses.filter((row) => matchesSearch(row, search));
    if (status !== 'all') rows = rows.filter((row) => row.status === status);
    if (sentiment !== 'all') rows = rows.filter((row) => row.sentiment === sentiment);

    rows = [...rows].sort((a, b) => {
      const result = compare(a, b, sortBy);
      return sortDir === 'asc' ? result : -result;
    });

    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize;
    const items = rows.slice(start, start + pageSize).map((r) => ({ ...r }));

    return { items, page: safePage, pageSize, total, totalPages };
  },

  /** Full detail payload for a single meeting. */
  async getAnalysis(id: string): Promise<MeetingDetail> {
    await delay(450);
    const row = analyses.find((m) => m.id === id);
    if (!row) throw { code: 'NOT_FOUND', message: 'errors.unknown', status: 404 };
    return buildDetail(row);
  },

  /** Deep-dive analysis payload (sentiment, competitors, keywords, etc.). */
  async getDeepDive(id: string): Promise<MeetingDeepDive> {
    await delay(550);
    const row = analyses.find((m) => m.id === id);
    if (!row) throw { code: 'NOT_FOUND', message: 'errors.unknown', status: 404 };
    return buildDeepDive(row);
  },
};
