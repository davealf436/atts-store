import { Router, Request, Response } from 'express';
import { requireAdmin, isTelegramAdminId } from './adminAuth';
import { accountDb } from './accountDb';

export const adminRouter = Router();

// Apply requireAdmin to all /api/admin/* endpoints
adminRouter.use(requireAdmin);

/**
 * GET /api/admin/verify
 * Validates that the active session belongs to an authorized Telegram admin.
 */
adminRouter.get('/verify', (req: Request, res: Response) => {
  const telegramId = (req as any).adminTelegramId;
  const account = (req as any).adminAccount || accountDb.getByTelegramId(telegramId);

  res.status(200).json({
    success: true,
    authorized: true,
    role: 'admin',
    telegramId,
    account,
    message: 'Authenticated as ATH Administrator',
  });
});
