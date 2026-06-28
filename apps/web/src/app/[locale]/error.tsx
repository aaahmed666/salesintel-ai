'use client';

import { useEffect } from 'react';
import { Button } from '@salesintel/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center dark:bg-slate-900">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Something went wrong!
      </h2>
      <p className="mt-2 max-w-md text-slate-500 dark:text-slate-400">
        An unexpected error occurred. Please try reloading or contact support if the issue persists.
      </p>
      {error && error.message && (
        <pre className="mt-4 max-w-lg overflow-auto rounded bg-slate-900 p-4 text-left text-xs text-red-400 dark:bg-slate-950">
          {error.message}
        </pre>
      )}
      <div className="mt-6 flex gap-4">
        <Button onClick={() => reset()}>
          Try again
        </Button>
        <Button onClick={() => window.location.reload()} variant="secondary">
          Reload Page
        </Button>
      </div>
    </div>
  );
}
