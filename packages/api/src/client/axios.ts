import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '@salesintel/config';

/**
 * A pluggable token provider. The web app wires this to its session store so
 * the API package stays framework-agnostic (no direct localStorage coupling).
 */
export interface TokenProvider {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  getLocale: () => string;
  /** Persist a refreshed token pair. */
  onTokensRefreshed?: (accessToken: string, refreshToken: string, expiresIn: number) => void;
  onUnauthorized?: () => void;
}

let tokenProvider: TokenProvider = {
  getAccessToken: () => null,
  getRefreshToken: () => null,
  getLocale: () => 'en',
};

/** Allow the host app to inject how tokens & locale are resolved. */
export function configureApiClient(provider: Partial<TokenProvider>): void {
  tokenProvider = { ...tokenProvider, ...provider };
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenProvider.getAccessToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  config.headers.set('Accept-Language', tokenProvider.getLocale());
  return config;
});

/* ----------------------- Auto-refresh on 401 ----------------------------- */
// A single in-flight refresh shared by all queued requests to avoid stampedes.
let refreshInFlight: Promise<string | null> | null = null;

interface RetriableConfig extends AxiosRequestConfig {
  _retried?: boolean;
}

async function performRefresh(): Promise<string | null> {
  const refreshToken = tokenProvider.getRefreshToken();
  if (!refreshToken) return null;

  try {
    // Bare axios call (NOT apiClient) so we don't recurse through interceptors.
    const { data } = await axios.post(
      `${env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
      { refresh_token: refreshToken },
      { headers: { 'Content-Type': 'application/json' } },
    );
    const u = data?.user;
    if (!u?.access_token) return null;
    tokenProvider.onTokensRefreshed?.(
      u.access_token,
      u.refresh_token,
      u.expires_in ?? 3600,
    );
    return u.access_token as string;
  } catch {
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const original = error?.config as RetriableConfig | undefined;

    const isAuthEndpoint =
      typeof original?.url === 'string' && original.url.includes('/auth/refresh');

    if (status === 401 && original && !original._retried && !isAuthEndpoint) {
      original._retried = true;

      if (!refreshInFlight) {
        refreshInFlight = performRefresh().finally(() => {
          refreshInFlight = null;
        });
      }
      const newToken = await refreshInFlight;

      if (newToken) {
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
        return apiClient.request(original);
      }

      tokenProvider.onUnauthorized?.();
    } else if (status === 401) {
      tokenProvider.onUnauthorized?.();
    }

    return Promise.reject(error);
  },
);
