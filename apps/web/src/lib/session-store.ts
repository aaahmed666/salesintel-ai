'use client';

import { STORAGE_KEYS } from '@salesintel/config';
import type { AuthSession } from '@salesintel/types';

/**
 * Minimal client-side session persistence. In production the access token would
 * ideally live in an httpOnly cookie; this store keeps the architecture simple
 * while exposing a stable interface the API client uses.
 */

type Listener = (session: AuthSession | null) => void;

const listeners = new Set<Listener>();

function read(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.session);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export const sessionStore = {
  get(): AuthSession | null {
    return read();
  },

  set(session: AuthSession): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
    listeners.forEach((l) => l(session));
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEYS.session);
    listeners.forEach((l) => l(null));
  },

  getAccessToken(): string | null {
    return read()?.tokens.accessToken ?? null;
  },

  getRefreshToken(): string | null {
    return read()?.tokens.refreshToken ?? null;
  },

  /** Update only the token pair after a silent refresh, keeping the user. */
  updateTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    const current = read();
    if (!current) return;
    const next: AuthSession = {
      ...current,
      tokens: { ...current.tokens, accessToken, refreshToken, expiresIn },
    };
    this.set(next);
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
