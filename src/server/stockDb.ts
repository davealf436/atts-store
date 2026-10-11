import fs from 'fs';
import path from 'path';
import { PlanStockRecord, StockHistoryRecord, DEFAULT_PLANS } from '../shared/stockData';

export type { PlanStockRecord, StockHistoryRecord };
export { DEFAULT_PLANS };

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STOCK_DB_PATH = path.resolve(DATA_DIR, 'stock-db.json');
const HISTORY_DB_PATH = path.resolve(DATA_DIR, 'stock-history.json');

class StockDatabase {
  private stockMap: Record<string, PlanStockRecord> = {};
  private history: StockHistoryRecord[] = [];
  private isLoaded = false;

  private ensureDataDir() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (e) {
      console.warn('[StockDb] Failed to create data dir:', e);
    }
  }

  private loadFromDisk() {
    this.ensureDataDir();

    // 1. Load stock map
    try {
      if (fs.existsSync(STOCK_DB_PATH)) {
        const raw = fs.readFileSync(STOCK_DB_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          this.stockMap = { ...DEFAULT_PLANS, ...parsed };
        } else {
          this.stockMap = { ...DEFAULT_PLANS };
        }
      } else {
        this.stockMap = { ...DEFAULT_PLANS };
        this.saveStockToDisk();
      }
    } catch (e) {
      console.warn('[StockDb] Error reading stock db file, using seed:', e);
      this.stockMap = { ...DEFAULT_PLANS };
    }

    // 2. Load history
    try {
      if (fs.existsSync(HISTORY_DB_PATH)) {
        const rawHistory = fs.readFileSync(HISTORY_DB_PATH, 'utf-8');
        const parsedHistory = JSON.parse(rawHistory);
        if (Array.isArray(parsedHistory)) {
          this.history = parsedHistory;
        }
      }
    } catch (e) {
      console.warn('[StockDb] Error reading history db file:', e);
      this.history = [];
    }

    this.isLoaded = true;
  }

  private saveStockToDisk() {
    this.ensureDataDir();
    try {
      fs.writeFileSync(STOCK_DB_PATH, JSON.stringify(this.stockMap, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[StockDb] Failed to save stock to disk:', e);
    }
  }

  private saveHistoryToDisk() {
    this.ensureDataDir();
    try {
      fs.writeFileSync(HISTORY_DB_PATH, JSON.stringify(this.history, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[StockDb] Failed to save history to disk:', e);
    }
  }

  private init() {
    if (!this.isLoaded) {
      this.loadFromDisk();
    }
  }

  private getKey(productId: string, planId: string): string {
    return `${productId}:${planId}`;
  }

  public getAll(): Record<string, PlanStockRecord> {
    this.init();
    return { ...this.stockMap };
  }

  public getPlan(productId: string, planId: string): PlanStockRecord | undefined {
    this.init();
    const key = this.getKey(productId, planId);
    return this.stockMap[key];
  }

  /**
   * Atomically consumes stock for multiple plan items in an order.
   * If any item exceeds available stock, rejects entire transaction to prevent overselling.
   */
  public consume(
    items: Array<{ productId: string; planId: string; quantity: number }>,
    orderNumber?: string
  ): { success: boolean; error?: string; remaining?: Record<string, number> } {
    this.init();

    // 1. Validation pass: check all items before mutating
    for (const item of items) {
      const key = this.getKey(item.productId, item.planId);
      const record = this.stockMap[key];
      if (!record) {
        return {
          success: false,
          error: `Plan not found for product "${item.productId}" plan "${item.planId}".`,
        };
      }
      if (record.stock < item.quantity) {
        return {
          success: false,
          error: `Cannot fulfill order. Only ${record.stock} license(s) available for "${record.productName} — ${record.planName}".`,
        };
      }
    }

    // 2. Execution pass: decrement atomically
    const now = new Date().toISOString();
    const remaining: Record<string, number> = {};

    for (const item of items) {
      const key = this.getKey(item.productId, item.planId);
      const record = this.stockMap[key];
      const stockBefore = record.stock;
      record.stock -= item.quantity;
      record.allocated += item.quantity;
      record.lastUpdated = now;

      remaining[key] = record.stock;

      // Record audit history
      const historyEntry: StockHistoryRecord = {
        id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: now,
        productId: record.productId,
        planId: record.planId,
        productName: record.productName,
        planName: record.planName,
        action: 'purchase',
        quantityDelta: -item.quantity,
        stockBefore,
        stockAfter: record.stock,
        orderNumber,
        reason: 'Customer purchase checkout',
        actor: 'customer',
      };
      this.history.unshift(historyEntry);
    }

    this.saveStockToDisk();
    this.saveHistoryToDisk();

    return { success: true, remaining };
  }

  /**
   * Restores stock for a plan (e.g. order cancelled, rejected, or refunded).
   */
  public restore(
    productId: string,
    planId: string,
    quantity: number,
    orderNumber?: string,
    reason: string = 'Order cancelled / refunded'
  ): { success: boolean; newStock?: number } {
    this.init();
    const key = this.getKey(productId, planId);
    const record = this.stockMap[key];
    if (!record) {
      return { success: false };
    }

    const stockBefore = record.stock;
    record.stock += quantity;
    record.allocated = Math.max(0, record.allocated - quantity);
    record.lastUpdated = new Date().toISOString();

    const historyEntry: StockHistoryRecord = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: record.lastUpdated,
      productId: record.productId,
      planId: record.planId,
      productName: record.productName,
      planName: record.planName,
      action: 'restore',
      quantityDelta: quantity,
      stockBefore,
      stockAfter: record.stock,
      orderNumber,
      reason,
      actor: 'system',
    };
    this.history.unshift(historyEntry);

    this.saveStockToDisk();
    this.saveHistoryToDisk();

    return { success: true, newStock: record.stock };
  }

  /**
   * Future Admin Portal methods: Set, Add, Remove, and History
   */
  public adminSet(
    productId: string,
    planId: string,
    newQuantity: number,
    reason?: string,
    actor: 'admin' | 'system' = 'admin'
  ): { success: boolean; newStock?: number } {
    this.init();
    const key = this.getKey(productId, planId);
    let record = this.stockMap[key];

    const qty = Math.max(0, newQuantity);
    const stockBefore = record ? record.stock : 0;

    if (!record) {
      record = {
        productId,
        planId,
        productName: productId,
        planName: planId,
        stock: qty,
        lowStockThreshold: 2,
        allocated: 0,
        lastUpdated: new Date().toISOString(),
      };
      this.stockMap[key] = record;
    } else {
      record.stock = qty;
      record.lastUpdated = new Date().toISOString();
    }

    this.history.unshift({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: record.lastUpdated,
      productId: record.productId,
      planId: record.planId,
      productName: record.productName,
      planName: record.planName,
      action: 'admin_set',
      quantityDelta: qty - stockBefore,
      stockBefore,
      stockAfter: qty,
      reason: reason || 'Admin manual quantity override',
      actor,
    });

    this.saveStockToDisk();
    this.saveHistoryToDisk();

    return { success: true, newStock: record.stock };
  }

  public adminAdd(
    productId: string,
    planId: string,
    addQuantity: number,
    reason?: string,
    actor: 'admin' | 'system' = 'admin'
  ): { success: boolean; newStock?: number } {
    this.init();
    const key = this.getKey(productId, planId);
    const record = this.stockMap[key];
    if (!record) return { success: false };

    const stockBefore = record.stock;
    record.stock += Math.max(0, addQuantity);
    record.lastUpdated = new Date().toISOString();

    this.history.unshift({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: record.lastUpdated,
      productId: record.productId,
      planId: record.planId,
      productName: record.productName,
      planName: record.planName,
      action: 'admin_add',
      quantityDelta: addQuantity,
      stockBefore,
      stockAfter: record.stock,
      reason: reason || 'Admin restocked inventory',
      actor,
    });

    this.saveStockToDisk();
    this.saveHistoryToDisk();

    return { success: true, newStock: record.stock };
  }

  public adminRemove(
    productId: string,
    planId: string,
    removeQuantity: number,
    reason?: string,
    actor: 'admin' | 'system' = 'admin'
  ): { success: boolean; newStock?: number } {
    this.init();
    const key = this.getKey(productId, planId);
    const record = this.stockMap[key];
    if (!record) return { success: false };

    const stockBefore = record.stock;
    record.stock = Math.max(0, record.stock - removeQuantity);
    record.lastUpdated = new Date().toISOString();

    this.history.unshift({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: record.lastUpdated,
      productId: record.productId,
      planId: record.planId,
      productName: record.productName,
      planName: record.planName,
      action: 'admin_remove',
      quantityDelta: -removeQuantity,
      stockBefore,
      stockAfter: record.stock,
      reason: reason || 'Admin inventory decrement',
      actor,
    });

    this.saveStockToDisk();
    this.saveHistoryToDisk();

    return { success: true, newStock: record.stock };
  }

  public getHistory(filter?: { productId?: string; planId?: string }): StockHistoryRecord[] {
    this.init();
    if (!filter) return this.history.slice(0, 100);

    return this.history
      .filter((h) => {
        if (filter.productId && h.productId !== filter.productId) return false;
        if (filter.planId && h.planId !== filter.planId) return false;
        return true;
      })
      .slice(0, 100);
  }
}

export const stockDb = new StockDatabase();
