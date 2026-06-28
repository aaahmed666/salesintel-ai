export type {
  User,
  AuthSession,
  AuthTokens,
  LoginResult,
  UserRole,
  MessageResult,
} from '@salesintel/types';

/** Drives the login screen's two-step (credentials → 2FA) state machine. */
export interface TwoFactorChallenge {
  challengeId: string;
  maskedEmail: string;
}
