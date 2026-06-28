import type { ReactNode } from 'react';

/**
 * The (auth) segment groups all unauthenticated screens. Each page renders its
 * own full-screen shell (centered or split) so this layout stays a passthrough.
 */
export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return children;
}
