import express, { Request, Response } from 'express';
import { stockRouter } from './stockRouter';
import { authRouter } from './authRouter';
import { adminRouter } from './adminRouter';

const app = express();
app.use(express.json());

// Mount Stock API routes (supporting both with /api prefix and without)
app.use('/api/stock', stockRouter);
app.use('/stock', stockRouter);

// Mount Telegram Auth API routes
app.use('/api/auth', authRouter);
app.use('/auth', authRouter);

// Mount Admin API routes (guarded by Telegram User ID security authority)
app.use('/api/admin', adminRouter);
app.use('/admin', adminRouter);

// Health and version check endpoints
const BUILD_VERSION = '2026.10.11-v5';
app.get(['/api/health', '/health'], (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'ATH Store API', version: BUILD_VERSION });
});

app.get(['/api/version', '/version'], (_req: Request, res: Response) => {
  res.json({
    version: BUILD_VERSION,
    timestamp: Date.now(),
    service: 'ATH Store Mini App',
  });
});

app.get(['/', '/api'], (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'ATH Store API', version: BUILD_VERSION });
});

// Vercel Serverless Function export
export default function handler(req: any, res: any) {
  return app(req, res);
}

export { app };
