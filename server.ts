import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { stockRouter } from './src/server/stockRouter';
import { authRouter } from './src/server/authRouter';
import { adminRouter } from './src/server/adminRouter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json());

  // Strict anti-caching middleware for HTML to prevent Telegram WebViews from serving stale builds
  app.use((req, res, next) => {
    const isHtmlRequest =
      req.path === '/' ||
      req.path === '/index.html' ||
      (!req.path.includes('.') && !req.path.startsWith('/api'));
    if (isHtmlRequest) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    next();
  });

  // Mount Stock API routes
  app.use('/api/stock', stockRouter);

  // Mount Telegram Auth API routes
  app.use('/api/auth', authRouter);

  // Mount Admin API routes (guarded by Telegram User ID security authority)
  app.use('/api/admin', adminRouter);

  // Health and version check endpoints
  const BUILD_VERSION = '2026.10.11-v3';
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'ATH Store API', version: BUILD_VERSION });
  });

  app.get('/api/version', (_req, res) => {
    res.json({
      version: BUILD_VERSION,
      timestamp: Date.now(),
      service: 'ATH Store Mini App',
    });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(
      express.static(distPath, {
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('index.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
          } else if (filePath.includes('/assets/')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
        },
      })
    );
    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Mount Vite dev server middlewares in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: PORT,
        host: '0.0.0.0',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ATH Store] Fullstack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[ATH Store] Failed to start server:', err);
  process.exit(1);
});
