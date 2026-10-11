import express, { Request, Response } from 'express';
import { stockRouter } from '../src/server/stockRouter';
import { authRouter } from '../src/server/authRouter';
import { adminRouter } from '../src/server/adminRouter';

const app = express();
app.use(express.json());

// Mount Stock API routes
app.use('/api/stock', stockRouter);

// Mount Telegram Auth API routes
app.use('/api/auth', authRouter);

// Mount Admin API routes (guarded by Telegram User ID security authority)
app.use('/api/admin', adminRouter);

// Health and version check endpoints
const BUILD_VERSION = '2026.10.11-v4';
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'ATH Store API', version: BUILD_VERSION });
});

app.get('/api/version', (_req: Request, res: Response) => {
  res.json({
    version: BUILD_VERSION,
    timestamp: Date.now(),
    service: 'ATH Store Mini App',
  });
});

export default app;
