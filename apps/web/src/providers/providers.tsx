'use client';

import { useState, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { configureApiClient } from '@salesintel/api';
import { isDevelopment } from '@salesintel/config';
import type { Locale } from '@salesintel/types';
import { makeQueryClient } from '@/lib/query-client';
import { sessionStore } from '@/lib/session-store';

interface ProvidersProps {
  children: ReactNode;
  locale: Locale;
}

/**
 * Wires the framework-agnostic API client to the app's session store and the
 * active locale, then provides the React Query context.
 */
export function Providers({ children, locale }: ProvidersProps) {
  const [queryClient] = useState(() => {
    configureApiClient({
      getAccessToken: () => sessionStore.getAccessToken(),
      getRefreshToken: () => sessionStore.getRefreshToken(),
      getLocale: () => locale,
      onTokensRefreshed: (accessToken, refreshToken, expiresIn) =>
        sessionStore.updateTokens(accessToken, refreshToken, expiresIn),
      onUnauthorized: () => sessionStore.clear(),
    });
    return makeQueryClient();
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
