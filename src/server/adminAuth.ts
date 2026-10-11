import { Request, Response, NextFunction } from 'express';
import { sessionStore } from './authRouter';
import { accountDb } from './accountDb';

/**
 * Authoritative list of Telegram User IDs granted the 'admin' role.
 * In accordance with Telegram Mini App security standards, the numeric Telegram User ID
 * is the sole cryptographic security authority (usernames are mutable and not used for access control).
 */
export const ADMIN_TELEGRAM_IDS: ReadonlySet<number> = new Set<number>([
  7638499069, // ΛBYSSIПIΛ VΣПDOR (@abyssiniavendor)
]);

/**
 * Checks whether a Telegram User ID is an authorized ATH admin.
 */
export function isTelegramAdminId(telegramId: number): boolean {
  return typeof telegramId === 'number' && ADMIN_TELEGRAM_IDS.has(telegramId);
}

/**
 * Express middleware to enforce admin access for /admin and /api/admin routes.
 * Authenticates via session token and verifies the permanent Telegram User ID.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Telegram authentication required. Please access via the ATH Telegram Bot.',
      });
      return;
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const session = sessionStore.getSession(token);

    if (!session) {
      res.status(401).json({
        success: false,
        error: 'SESSION_EXPIRED',
        message: 'Session expired. Please reconnect from Telegram.',
      });
      return;
    }

    // Security Authority Check: strictly evaluate numeric Telegram User ID
    if (!isTelegramAdminId(session.telegramId)) {
      console.warn(`[Security] Unauthorized /admin access attempt by Telegram ID: ${session.telegramId}`);
      res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'Access denied: Telegram User ID is not authorized for administrative access.',
      });
      return;
    }

    const account = accountDb.getByTelegramId(session.telegramId);
    (req as any).adminAccount = account;
    (req as any).adminTelegramId = session.telegramId;

    next();
  } catch (err: any) {
    console.error('[AdminAuth] Exception in requireAdmin middleware:', err);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Internal authorization error.',
    });
  }
}
