import type { User } from '@salesintel/types';

/** Simulated network latency so loading states are observable in the UI. */
export function delay(ms = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface StoredUser extends User {
  password: string;
}

/**
 * Seed accounts. Use these to exercise the auth flows:
 *  - admin@enterprise.ai / Password123! → triggers 2FA challenge
 *  - rep@enterprise.ai   / Password123! → direct login (no 2FA)
 */
export const mockUsers: StoredUser[] = [
  {
    id: 'usr_admin',
    fullName: 'Jordan Avery',
    email: 'admin@enterprise.ai',
    password: 'Password123!',
    role: 'admin',
    status: 'active',
    emailVerified: true,
    twoFactorEnabled: true,
    createdAt: '2024-01-12T09:00:00.000Z',
  },
  {
    id: 'usr_rep',
    fullName: 'Sam Rivera',
    email: 'rep@enterprise.ai',
    password: 'Password123!',
    role: 'sales_rep',
    status: 'active',
    emailVerified: true,
    twoFactorEnabled: false,
    createdAt: '2024-03-04T09:00:00.000Z',
  },
];

/** Outstanding 2FA challenges keyed by challengeId. */
export const challenges = new Map<string, { userId: string; code: string }>();

/** Outstanding password-reset / email-verification tokens. */
export const tokens = new Map<string, { userId: string; kind: 'reset' | 'verify' }>();

export function findUserByEmail(email: string): StoredUser | undefined {
  return mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function toPublicUser(user: StoredUser): User {
  // Strip the password before returning to the client.
  const { password: _password, ...rest } = user;
  return rest;
}

export function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  const visible = name.slice(0, 1);
  return `${visible}${'*'.repeat(Math.max(name.length - 1, 3))}@${domain}`;
}

export function randomId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function randomCode(length = 6): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}
