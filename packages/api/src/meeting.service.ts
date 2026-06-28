import { mocksEnabled, env } from '@salesintel/config';
import type {
  CreateUploadInput,
  CreateUploadResult,
  Meeting,
  MeetingAnalysis,
  MeetingDeepDive,
  MeetingDetail,
  MeetingListParams,
  Paginated,
} from '@salesintel/types';
import { apiClient, normalizeError } from './client';
import { mockAnalysisApi, mockMeetingApi } from './mock';

/** Result of physically uploading the binary to the backend `/upload`. */
export interface UploadedFile {
  fileId: string;
  url: string;
  size: number;
  contentType: string;
}

export interface MeetingService {
  /** Physically upload the binary; returns the stored file reference. */
  uploadFile(file: File, onProgress?: (pct: number) => void): Promise<UploadedFile>;
  createUpload(input: CreateUploadInput & { fileId?: string; fileUrl?: string }): Promise<CreateUploadResult>;
  listMeetings(): Promise<Meeting[]>;
  retryUpload(meetingId: string): Promise<Meeting>;
  listAnalyses(params?: MeetingListParams): Promise<Paginated<MeetingAnalysis>>;
  getAnalysis(id: string): Promise<MeetingDetail>;
  getDeepDive(id: string): Promise<MeetingDeepDive>;
}

async function request<T>(method: 'get' | 'post', url: string, body?: unknown): Promise<T> {
  try {
    const { data } =
      method === 'get'
        ? await apiClient.get<{ data: T }>(url)
        : await apiClient.post<{ data: T }>(url, body);
    return data.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

function toQuery(params: MeetingListParams = {}): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

const httpMeetingApi: MeetingService = {
  async uploadFile(file, onProgress) {
    try {
      const form = new FormData();
      form.append('file', file);
      // /upload is mounted at the API root (NOT under /api/v1), so we post to
      // an absolute URL derived from the configured base.
      const root = env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api\/v1\/?$/, '');
      const { data } = await apiClient.post(`${root}/upload`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
      return {
        fileId: data.file_id,
        url: data.url,
        size: data.size,
        contentType: data.content_type,
      };
    } catch (error) {
      throw normalizeError(error);
    }
  },

  createUpload: (input) =>
    request('post', '/meetings/uploads', {
      fileName: input.fileName,
      size: input.size,
      mimeType: input.mimeType,
      fileId: input.fileId,
      fileUrl: input.fileUrl,
    }),
  listMeetings: () => request('get', '/meetings'),
  retryUpload: (meetingId) => request('post', `/meetings/${meetingId}/retry`),
  listAnalyses: (params) => request('get', `/meetings/analyses${toQuery(params)}`),
  getAnalysis: (id) => request('get', `/meetings/${id}/analysis`),
  getDeepDive: (id) => request('get', `/meetings/${id}/deep-dive`),
};

/* ------------------------- Mock parity (dev-only) ------------------------ */
const mockService: MeetingService = {
  ...(mockMeetingApi as unknown as MeetingService),
  ...(mockAnalysisApi as unknown as Partial<MeetingService>),
  async uploadFile(_file, onProgress) {
    // Simulate a quick upload in mock mode.
    onProgress?.(100);
    return { fileId: `mock_${Date.now()}`, url: '#', size: _file.size, contentType: _file.type };
  },
} as MeetingService;

export const meetingService: MeetingService = mocksEnabled ? mockService : httpMeetingApi;
