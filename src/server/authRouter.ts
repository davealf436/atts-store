import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { accountDb } from './accountDb';
import { validateTelegramInitData, generateSignedInitData } from './authTelegram';
import { isTelegramAdminId } from './adminAuth';
import { AthAccount } from '../types';

export const authRouter = Router();

// Active session token metadata
export interface SessionData {
  telegramId: number;
  expiresAt: number;
  createdAt: number;
}

// In-memory active session tokens map: token -> SessionData
const activeSessions: Map<string, SessionData> = new Map();

// Helper to generate a secure random session token (192 bits entropy)
export function generateSessionToken(): string {
  return 'ath_sess_' + crypto.randomBytes(24).toString('hex');
}

// Session management API
export const sessionStore = {
  createSession(telegramId: number, ttlMs: number = 30 * 24 * 60 * 60 * 1000): { token: string; expiresAt: number } {
    const token = generateSessionToken();
    const now = Date.now();
    const expiresAt = now + ttlMs;
    activeSessions.set(token, { telegramId, expiresAt, createdAt: now });
    return { token, expiresAt };
  },

  getSession(token: string): SessionData | null {
    if (!token) return null;
    const session = activeSessions.get(token);
    if (!session) return null;
    if (session.expiresAt < Date.now()) {
      activeSessions.delete(token);
      return null;
    }
    return session;
  },

  revokeSession(token: string): boolean {
    if (!token) return false;
    return activeSessions.delete(token);
  },

  revokeAllSessionsForTelegramId(telegramId: number): number {
    let count = 0;
    for (const [token, data] of activeSessions.entries()) {
      if (data.telegramId === telegramId) {
        activeSessions.delete(token);
        count++;
      }
    }
    return count;
  },

  cleanupExpired(): number {
    const now = Date.now();
    let removed = 0;
    for (const [token, data] of activeSessions.entries()) {
      if (data.expiresAt < now) {
        activeSessions.delete(token);
        removed++;
      }
    }
    return removed;
  },

  clearAll(): void {
    activeSessions.clear();
  },

  getActiveCount(): number {
    return activeSessions.size;
  },
};

/**
 * POST /api/auth/telegram
 * Validates Telegram Mini App initData on the backend, creates or loads the ATH account,
 * and returns an authenticated session.
 */
authRouter.post('/telegram', (req: Request, res: Response) => {
  try {
    const { initData } = req.body;

    if (!initData || typeof initData !== 'string') {
      res.status(401).json({
        success: false,
        error: 'MISSING_INIT_DATA',
        message: 'Unable to connect your Telegram account. Please reopen ATH from Telegram.',
      });
      return;
    }

    // Server-side cryptographic HMAC-SHA256 signature and freshness verification
    const validation = validateTelegramInitData(initData);

    if (!validation.valid || !validation.user) {
      console.warn('[AuthRouter] Telegram verification failed:', validation.error);
      const isExpired = validation.error === 'EXPIRED_INIT_DATA';
      res.status(401).json({
        success: false,
        error: validation.error || 'UNVERIFIED_TELEGRAM_SESSION',
        message: isExpired
          ? 'Authentication session expired. Please reopen ATH from Telegram.'
          : 'Unable to connect your Telegram account. Please reopen ATH from Telegram.',
      });
      return;
    }

    // Upsert the permanent ATH account using Telegram User ID
    const { account, isNew } = accountDb.upsertTelegramAccount(validation.user);

    // Create session token (valid for 30 days)
    const { token, expiresAt } = sessionStore.createSession(account.telegramId);

    res.status(200).json({
      success: true,
      account,
      token,
      expiresAt,
      isNew,
    });
  } catch (err: any) {
    console.error('[AuthRouter] Error in /telegram auth:', err);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_AUTH_ERROR',
      message: 'Unable to connect your Telegram account. Please reopen ATH from Telegram.',
    });
  }
});

/**
 * GET /api/auth/me
 * Retrieves current authenticated user profile using session token.
 */
authRouter.get('/me', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: 'NO_TOKEN' });
      return;
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const session = sessionStore.getSession(token);

    if (!session) {
      res.status(401).json({ success: false, error: 'SESSION_EXPIRED' });
      return;
    }

    const account = accountDb.getByTelegramId(session.telegramId);
    if (!account) {
      res.status(404).json({ success: false, error: 'ACCOUNT_NOT_FOUND' });
      return;
    }

    res.status(200).json({
      success: true,
      account,
    });
  } catch (err: any) {
    console.error('[AuthRouter] Error in /me:', err);
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
});

/**
 * POST /api/auth/logout
 * Revokes current active session token so it cannot be used again.
 */
authRouter.post('/logout', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(400).json({ success: false, error: 'NO_TOKEN' });
      return;
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const revoked = sessionStore.revokeSession(token);

    res.status(200).json({
      success: true,
      revoked,
      message: 'Logged out successfully',
    });
  } catch (err: any) {
    console.error('[AuthRouter] Error in /logout:', err);
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
});

/**
 * GET /api/auth/admin-check
 * Verifies if the authenticated session token corresponds to an authorized Telegram admin.
 * Uses permanent Telegram User ID as the security authority.
 */
authRouter.get('/admin-check', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, authorized: false, error: 'NO_TOKEN' });
      return;
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const session = sessionStore.getSession(token);

    if (!session) {
      res.status(401).json({ success: false, authorized: false, error: 'SESSION_EXPIRED' });
      return;
    }

    // Security Authority Check: Telegram User ID, not username
    const authorized = isTelegramAdminId(session.telegramId);
    const account = accountDb.getByTelegramId(session.telegramId);

    res.status(200).json({
      success: true,
      authorized,
      role: authorized ? 'admin' : 'customer',
      telegramId: session.telegramId,
      account,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, authorized: false, error: 'SERVER_ERROR' });
  }
});

/**
 * GET /api/auth/preview-initdata
 * Provides signed Telegram initData for development/preview environments outside native Telegram.
 */
authRouter.get('/preview-initdata', (req: Request, res: Response) => {
  try {
    const { simulate_error, simulate_expired, admin, as_admin } = req.query;

    if (simulate_error === 'true' || simulate_error === '1') {
      res.status(200).json({
        success: true,
        initData: 'invalid_tampered_preview_hash',
      });
      return;
    }

    const isAdminSim = admin === 'true' || admin === '1' || as_admin === 'true' || as_admin === '1';

    // Preview user: default customer or authoritative admin when simulating admin
    const previewUser = isAdminSim
      ? {
          id: 7638499069,
          first_name: 'ΛBYSSIПIΛ',
          last_name: 'VΣПDOR',
          username: 'abyssiniavendor',
          language_code: 'en',
        }
      : {
          id: 984572019,
          first_name: 'Dave',
          last_name: 'Alf',
          username: 'davealf436',
          language_code: 'en',
        };

    // If simulated expired, create authDate 48 hours ago
    const customAuthDate = (simulate_expired === 'true' || simulate_expired === '1')
      ? Math.floor(Date.now() / 1000) - (48 * 3600)
      : undefined;

    const signedInitData = generateSignedInitData(previewUser, undefined, customAuthDate);

    res.status(200).json({
      success: true,
      initData: signedInitData,
      user: previewUser,
      expired: Boolean(customAuthDate),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'FAILED_TO_GENERATE_PREVIEW' });
  }
});
