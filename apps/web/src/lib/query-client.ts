import { QueryClient } from '@tanstack/react-query';
import {
  DEFAULT_QUERY_RETRY,
  QUERY_GC_TIME,
  QUERY_STALE_TIME,
} from '@salesintel/config';

/** Create a configured QueryClient. One instance per browser session. */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME,
        gcTime: QUERY_GC_TIME,
        retry: DEFAULT_QUERY_RETRY,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
