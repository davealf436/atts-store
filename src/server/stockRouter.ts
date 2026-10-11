import { Router, Request, Response } from 'express';
import { stockDb } from './stockDb';

export const stockRouter = Router();

// GET /api/stock — Returns all per-plan stock records
stockRouter.get('/', (_req: Request, res: Response) => {
  try {
    const all = stockDb.getAll();
    res.json({ success: true, stock: all });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || 'Failed to fetch stock' });
  }
});

// GET /api/stock/:productId/:planId — Returns single plan stock record
stockRouter.get('/:productId/:planId', (req: Request, res: Response) => {
  try {
    const { productId, planId } = req.params;
    const plan = stockDb.getPlan(productId, planId);
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Plan stock record not found' });
    }
    res.json({ success: true, plan });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || 'Failed to fetch plan stock' });
  }
});

// POST /api/stock/consume — Atomically consumes stock, preventing overselling
stockRouter.post('/consume', (req: Request, res: Response) => {
  try {
    const { items, orderNumber } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Items array is required' });
    }

    const result = stockDb.consume(items, orderNumber);
    if (!result.success) {
      // 409 Conflict represents insufficient stock / race condition prevented
      return res.status(409).json(result);
    }

    res.json({ success: true, remaining: result.remaining });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || 'Failed to consume stock' });
  }
});

// POST /api/stock/restore — Restores stock when order is cancelled/rejected/returned
stockRouter.post('/restore', (req: Request, res: Response) => {
  try {
    const { productId, planId, quantity, orderNumber, reason } = req.body;
    if (!productId || !planId || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ success: false, error: 'productId, planId and positive quantity required' });
    }

    const result = stockDb.restore(productId, planId, quantity, orderNumber, reason);
    if (!result.success) {
      return res.status(404).json({ success: false, error: 'Plan not found to restore' });
    }

    res.json({ success: true, newStock: result.newStock });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || 'Failed to restore stock' });
  }
});

// GET /api/stock/history — Audit history of stock movements (for future Admin Portal)
stockRouter.get('/history', (req: Request, res: Response) => {
  try {
    const { productId, planId } = req.query;
    const history = stockDb.getHistory({
      productId: typeof productId === 'string' ? productId : undefined,
      planId: typeof planId === 'string' ? planId : undefined,
    });
    res.json({ success: true, history });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || 'Failed to fetch stock history' });
  }
});

// POST /api/stock/admin/set — Admin set exact stock (for future Admin Portal)
stockRouter.post('/admin/set', (req: Request, res: Response) => {
  try {
    const { productId, planId, quantity, reason, actor } = req.body;
    if (!productId || !planId || typeof quantity !== 'number') {
      return res.status(400).json({ success: false, error: 'productId, planId and quantity required' });
    }
    const result = stockDb.adminSet(productId, planId, quantity, reason, actor || 'admin');
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || 'Failed to set stock' });
  }
});

// POST /api/stock/admin/add — Admin add stock (for future Admin Portal)
stockRouter.post('/admin/add', (req: Request, res: Response) => {
  try {
    const { productId, planId, quantity, reason, actor } = req.body;
    if (!productId || !planId || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ success: false, error: 'productId, planId and positive quantity required' });
    }
    const result = stockDb.adminAdd(productId, planId, quantity, reason, actor || 'admin');
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || 'Failed to add stock' });
  }
});

// POST /api/stock/admin/remove — Admin remove stock (for future Admin Portal)
stockRouter.post('/admin/remove', (req: Request, res: Response) => {
  try {
    const { productId, planId, quantity, reason, actor } = req.body;
    if (!productId || !planId || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ success: false, error: 'productId, planId and positive quantity required' });
    }
    const result = stockDb.adminRemove(productId, planId, quantity, reason, actor || 'admin');
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || 'Failed to remove stock' });
  }
});
