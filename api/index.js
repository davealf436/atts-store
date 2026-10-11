// src/server/apiEntry.ts
import express from "express";

// src/server/stockRouter.ts
import { Router } from "express";

// src/server/stockDb.ts
import fs from "fs";
import path from "path";

// src/shared/stockData.ts
var DEFAULT_PLANS = {
  // FX Replay Pro (Essential Plan)
  "fxreplay-pro:6d": {
    productId: "fxreplay-pro",
    planId: "6d",
    productName: "FX Replay Pro",
    planName: "7 Days",
    stock: 4,
    lowStockThreshold: 2,
    allocated: 12,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  "fxreplay-pro:2w": {
    productId: "fxreplay-pro",
    planId: "2w",
    productName: "FX Replay Pro",
    planName: "2 Weeks",
    stock: 2,
    lowStockThreshold: 2,
    allocated: 18,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  "fxreplay-pro:1m": {
    productId: "fxreplay-pro",
    planId: "1m",
    productName: "FX Replay Pro",
    planName: "1 Month",
    stock: 0,
    // Explicitly Out of Stock as requested in example
    lowStockThreshold: 2,
    allocated: 30,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  "fxreplay-pro:3m": {
    productId: "fxreplay-pro",
    planId: "3m",
    productName: "FX Replay Pro",
    planName: "3 Months",
    stock: 5,
    lowStockThreshold: 2,
    allocated: 8,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  // FX Replay Pro (Premium Plan)
  "fxreplay-premium:1m": {
    productId: "fxreplay-premium",
    planId: "1m",
    productName: "FX Replay Pro",
    planName: "1 Month",
    stock: 3,
    lowStockThreshold: 2,
    allocated: 7,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  "fxreplay-premium:annual": {
    productId: "fxreplay-premium",
    planId: "annual",
    productName: "FX Replay Pro",
    planName: "Annual",
    stock: 2,
    lowStockThreshold: 2,
    allocated: 5,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  // DeepCharts
  "deepcharts:1m": {
    productId: "deepcharts",
    planId: "1m",
    productName: "DeepCharts",
    planName: "1 Month",
    stock: 6,
    lowStockThreshold: 2,
    allocated: 9,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  "deepcharts:3m": {
    productId: "deepcharts",
    planId: "3m",
    productName: "DeepCharts",
    planName: "3 Months",
    stock: 4,
    lowStockThreshold: 2,
    allocated: 6,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  "deepcharts:annual": {
    productId: "deepcharts",
    planId: "annual",
    productName: "DeepCharts",
    planName: "Annual",
    stock: 2,
    lowStockThreshold: 2,
    allocated: 4,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  // TradingView Premium
  "tv-premium:1m": {
    productId: "tv-premium",
    planId: "1m",
    productName: "TradingView Premium",
    planName: "1 Month",
    stock: 5,
    lowStockThreshold: 2,
    allocated: 15,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  "tv-premium:3m": {
    productId: "tv-premium",
    planId: "3m",
    productName: "TradingView Premium",
    planName: "3 Months",
    stock: 3,
    lowStockThreshold: 2,
    allocated: 10,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  "tv-premium:annual": {
    productId: "tv-premium",
    planId: "annual",
    productName: "TradingView Premium",
    planName: "Annual",
    stock: 2,
    lowStockThreshold: 2,
    allocated: 6,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  // TradingView Plus
  "tv-plus:1m": {
    productId: "tv-plus",
    planId: "1m",
    productName: "TradingView Plus",
    planName: "1 Month",
    stock: 8,
    lowStockThreshold: 2,
    allocated: 14,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  "tv-plus:3m": {
    productId: "tv-plus",
    planId: "3m",
    productName: "TradingView Plus",
    planName: "3 Months",
    stock: 4,
    lowStockThreshold: 2,
    allocated: 8,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  "tv-plus:annual": {
    productId: "tv-plus",
    planId: "annual",
    productName: "TradingView Plus",
    planName: "Annual",
    stock: 3,
    lowStockThreshold: 2,
    allocated: 5,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  // TradingView Essential
  "tv-essential:1m": {
    productId: "tv-essential",
    planId: "1m",
    productName: "TradingView Essential",
    planName: "1 Month",
    stock: 12,
    lowStockThreshold: 3,
    allocated: 20,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  "tv-essential:3m": {
    productId: "tv-essential",
    planId: "3m",
    productName: "TradingView Essential",
    planName: "3 Months",
    stock: 8,
    lowStockThreshold: 3,
    allocated: 14,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  "tv-essential:annual": {
    productId: "tv-essential",
    planId: "annual",
    productName: "TradingView Essential",
    planName: "Annual",
    stock: 4,
    lowStockThreshold: 2,
    allocated: 8,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  // Telegram Premium
  "telegram-premium:1m": {
    productId: "telegram-premium",
    planId: "1m",
    productName: "Telegram Premium",
    planName: "1 Month",
    stock: 8,
    lowStockThreshold: 3,
    allocated: 16,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  "telegram-premium:3m": {
    productId: "telegram-premium",
    planId: "3m",
    productName: "Telegram Premium",
    planName: "3 Months",
    stock: 5,
    lowStockThreshold: 2,
    allocated: 9,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  "telegram-premium:annual": {
    productId: "telegram-premium",
    planId: "annual",
    productName: "Telegram Premium",
    planName: "Annual",
    stock: 3,
    lowStockThreshold: 2,
    allocated: 5,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  // Google AI
  "google-ai:1m": {
    productId: "google-ai",
    planId: "1m",
    productName: "Google AI",
    planName: "1 Month",
    stock: 4,
    lowStockThreshold: 2,
    allocated: 11,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  "google-ai:3m": {
    productId: "google-ai",
    planId: "3m",
    productName: "Google AI",
    planName: "3 Months",
    stock: 3,
    lowStockThreshold: 2,
    allocated: 7,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  "google-ai:annual": {
    productId: "google-ai",
    planId: "annual",
    productName: "Google AI",
    planName: "Annual",
    stock: 1,
    // Genuinely low stock
    lowStockThreshold: 2,
    allocated: 4,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  // Free Journaling Tools (Always in stock)
  "abyssinia-journal:1m": {
    productId: "abyssinia-journal",
    planId: "1m",
    productName: "Abyssinia Journal",
    planName: "1 Month",
    stock: 42,
    lowStockThreshold: 5,
    allocated: 58,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  "backtesting-journal:1m": {
    productId: "backtesting-journal",
    planId: "1m",
    productName: "Backtesting Journal",
    planName: "1 Month",
    stock: 35,
    lowStockThreshold: 5,
    allocated: 45,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  },
  "notion-template-journal:1m": {
    productId: "notion-template-journal",
    planId: "1m",
    productName: "Notion Template Journal",
    planName: "1 Month",
    stock: 88,
    lowStockThreshold: 5,
    allocated: 112,
    lastUpdated: "2026-10-07T00:00:00.000Z"
  }
};

// src/server/stockDb.ts
var DATA_DIR = path.resolve(process.cwd(), "data");
var STOCK_DB_PATH = path.resolve(DATA_DIR, "stock-db.json");
var HISTORY_DB_PATH = path.resolve(DATA_DIR, "stock-history.json");
var StockDatabase = class {
  constructor() {
    this.stockMap = {};
    this.history = [];
    this.isLoaded = false;
  }
  getStockDbPath() {
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      const tmpDir = path.resolve("/tmp", "ath_data");
      try {
        if (!fs.existsSync(tmpDir)) {
          fs.mkdirSync(tmpDir, { recursive: true });
        }
        return path.resolve(tmpDir, "stock-db.json");
      } catch {
      }
    }
    return STOCK_DB_PATH;
  }
  getHistoryDbPath() {
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      const tmpDir = path.resolve("/tmp", "ath_data");
      try {
        if (!fs.existsSync(tmpDir)) {
          fs.mkdirSync(tmpDir, { recursive: true });
        }
        return path.resolve(tmpDir, "stock-history.json");
      } catch {
      }
    }
    return HISTORY_DB_PATH;
  }
  ensureDataDir() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch {
    }
  }
  loadFromDisk() {
    this.ensureDataDir();
    const activeStockPath = this.getStockDbPath();
    const activeHistoryPath = this.getHistoryDbPath();
    try {
      const targetPath = fs.existsSync(activeStockPath) ? activeStockPath : fs.existsSync(STOCK_DB_PATH) ? STOCK_DB_PATH : null;
      if (targetPath) {
        const raw = fs.readFileSync(targetPath, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          this.stockMap = { ...DEFAULT_PLANS, ...parsed };
        } else {
          this.stockMap = { ...DEFAULT_PLANS };
        }
      } else {
        this.stockMap = { ...DEFAULT_PLANS };
        this.saveStockToDisk();
      }
    } catch {
      this.stockMap = { ...DEFAULT_PLANS };
    }
    try {
      const targetPath = fs.existsSync(activeHistoryPath) ? activeHistoryPath : fs.existsSync(HISTORY_DB_PATH) ? HISTORY_DB_PATH : null;
      if (targetPath) {
        const rawHistory = fs.readFileSync(targetPath, "utf-8");
        const parsedHistory = JSON.parse(rawHistory);
        if (Array.isArray(parsedHistory)) {
          this.history = parsedHistory;
        }
      }
    } catch {
      this.history = [];
    }
    this.isLoaded = true;
  }
  saveStockToDisk() {
    this.ensureDataDir();
    const targetPath = this.getStockDbPath();
    try {
      fs.writeFileSync(targetPath, JSON.stringify(this.stockMap, null, 2), "utf-8");
    } catch {
    }
  }
  saveHistoryToDisk() {
    this.ensureDataDir();
    const targetPath = this.getHistoryDbPath();
    try {
      fs.writeFileSync(targetPath, JSON.stringify(this.history, null, 2), "utf-8");
    } catch {
    }
  }
  init() {
    if (!this.isLoaded) {
      this.loadFromDisk();
    }
  }
  getKey(productId, planId) {
    return `${productId}:${planId}`;
  }
  getAll() {
    this.init();
    return { ...this.stockMap };
  }
  getPlan(productId, planId) {
    this.init();
    const key = this.getKey(productId, planId);
    return this.stockMap[key];
  }
  /**
   * Atomically consumes stock for multiple plan items in an order.
   * If any item exceeds available stock, rejects entire transaction to prevent overselling.
   */
  consume(items, orderNumber) {
    this.init();
    for (const item of items) {
      const key = this.getKey(item.productId, item.planId);
      const record = this.stockMap[key];
      if (!record) {
        return {
          success: false,
          error: `Plan not found for product "${item.productId}" plan "${item.planId}".`
        };
      }
      if (record.stock < item.quantity) {
        return {
          success: false,
          error: `Cannot fulfill order. Only ${record.stock} license(s) available for "${record.productName} \u2014 ${record.planName}".`
        };
      }
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const remaining = {};
    for (const item of items) {
      const key = this.getKey(item.productId, item.planId);
      const record = this.stockMap[key];
      const stockBefore = record.stock;
      record.stock -= item.quantity;
      record.allocated += item.quantity;
      record.lastUpdated = now;
      remaining[key] = record.stock;
      const historyEntry = {
        id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: now,
        productId: record.productId,
        planId: record.planId,
        productName: record.productName,
        planName: record.planName,
        action: "purchase",
        quantityDelta: -item.quantity,
        stockBefore,
        stockAfter: record.stock,
        orderNumber,
        reason: "Customer purchase checkout",
        actor: "customer"
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
  restore(productId, planId, quantity, orderNumber, reason = "Order cancelled / refunded") {
    this.init();
    const key = this.getKey(productId, planId);
    const record = this.stockMap[key];
    if (!record) {
      return { success: false };
    }
    const stockBefore = record.stock;
    record.stock += quantity;
    record.allocated = Math.max(0, record.allocated - quantity);
    record.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    const historyEntry = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: record.lastUpdated,
      productId: record.productId,
      planId: record.planId,
      productName: record.productName,
      planName: record.planName,
      action: "restore",
      quantityDelta: quantity,
      stockBefore,
      stockAfter: record.stock,
      orderNumber,
      reason,
      actor: "system"
    };
    this.history.unshift(historyEntry);
    this.saveStockToDisk();
    this.saveHistoryToDisk();
    return { success: true, newStock: record.stock };
  }
  /**
   * Future Admin Portal methods: Set, Add, Remove, and History
   */
  adminSet(productId, planId, newQuantity, reason, actor = "admin") {
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
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.stockMap[key] = record;
    } else {
      record.stock = qty;
      record.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    }
    this.history.unshift({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: record.lastUpdated,
      productId: record.productId,
      planId: record.planId,
      productName: record.productName,
      planName: record.planName,
      action: "admin_set",
      quantityDelta: qty - stockBefore,
      stockBefore,
      stockAfter: qty,
      reason: reason || "Admin manual quantity override",
      actor
    });
    this.saveStockToDisk();
    this.saveHistoryToDisk();
    return { success: true, newStock: record.stock };
  }
  adminAdd(productId, planId, addQuantity, reason, actor = "admin") {
    this.init();
    const key = this.getKey(productId, planId);
    const record = this.stockMap[key];
    if (!record) return { success: false };
    const stockBefore = record.stock;
    record.stock += Math.max(0, addQuantity);
    record.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    this.history.unshift({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: record.lastUpdated,
      productId: record.productId,
      planId: record.planId,
      productName: record.productName,
      planName: record.planName,
      action: "admin_add",
      quantityDelta: addQuantity,
      stockBefore,
      stockAfter: record.stock,
      reason: reason || "Admin restocked inventory",
      actor
    });
    this.saveStockToDisk();
    this.saveHistoryToDisk();
    return { success: true, newStock: record.stock };
  }
  adminRemove(productId, planId, removeQuantity, reason, actor = "admin") {
    this.init();
    const key = this.getKey(productId, planId);
    const record = this.stockMap[key];
    if (!record) return { success: false };
    const stockBefore = record.stock;
    record.stock = Math.max(0, record.stock - removeQuantity);
    record.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    this.history.unshift({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: record.lastUpdated,
      productId: record.productId,
      planId: record.planId,
      productName: record.productName,
      planName: record.planName,
      action: "admin_remove",
      quantityDelta: -removeQuantity,
      stockBefore,
      stockAfter: record.stock,
      reason: reason || "Admin inventory decrement",
      actor
    });
    this.saveStockToDisk();
    this.saveHistoryToDisk();
    return { success: true, newStock: record.stock };
  }
  getHistory(filter) {
    this.init();
    if (!filter) return this.history.slice(0, 100);
    return this.history.filter((h) => {
      if (filter.productId && h.productId !== filter.productId) return false;
      if (filter.planId && h.planId !== filter.planId) return false;
      return true;
    }).slice(0, 100);
  }
};
var stockDb = new StockDatabase();

// src/server/stockRouter.ts
var stockRouter = Router();
stockRouter.get("/", (_req, res) => {
  try {
    const all = stockDb.getAll();
    res.json({ success: true, stock: all });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || "Failed to fetch stock" });
  }
});
stockRouter.get("/:productId/:planId", (req, res) => {
  try {
    const { productId, planId } = req.params;
    const plan = stockDb.getPlan(productId, planId);
    if (!plan) {
      return res.status(404).json({ success: false, error: "Plan stock record not found" });
    }
    res.json({ success: true, plan });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || "Failed to fetch plan stock" });
  }
});
stockRouter.post("/consume", (req, res) => {
  try {
    const { items, orderNumber } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: "Items array is required" });
    }
    const result = stockDb.consume(items, orderNumber);
    if (!result.success) {
      return res.status(409).json(result);
    }
    res.json({ success: true, remaining: result.remaining });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || "Failed to consume stock" });
  }
});
stockRouter.post("/restore", (req, res) => {
  try {
    const { productId, planId, quantity, orderNumber, reason } = req.body;
    if (!productId || !planId || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ success: false, error: "productId, planId and positive quantity required" });
    }
    const result = stockDb.restore(productId, planId, quantity, orderNumber, reason);
    if (!result.success) {
      return res.status(404).json({ success: false, error: "Plan not found to restore" });
    }
    res.json({ success: true, newStock: result.newStock });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || "Failed to restore stock" });
  }
});
stockRouter.get("/history", (req, res) => {
  try {
    const { productId, planId } = req.query;
    const history = stockDb.getHistory({
      productId: typeof productId === "string" ? productId : void 0,
      planId: typeof planId === "string" ? planId : void 0
    });
    res.json({ success: true, history });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || "Failed to fetch stock history" });
  }
});
stockRouter.post("/admin/set", (req, res) => {
  try {
    const { productId, planId, quantity, reason, actor } = req.body;
    if (!productId || !planId || typeof quantity !== "number") {
      return res.status(400).json({ success: false, error: "productId, planId and quantity required" });
    }
    const result = stockDb.adminSet(productId, planId, quantity, reason, actor || "admin");
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || "Failed to set stock" });
  }
});
stockRouter.post("/admin/add", (req, res) => {
  try {
    const { productId, planId, quantity, reason, actor } = req.body;
    if (!productId || !planId || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ success: false, error: "productId, planId and positive quantity required" });
    }
    const result = stockDb.adminAdd(productId, planId, quantity, reason, actor || "admin");
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || "Failed to add stock" });
  }
});
stockRouter.post("/admin/remove", (req, res) => {
  try {
    const { productId, planId, quantity, reason, actor } = req.body;
    if (!productId || !planId || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ success: false, error: "productId, planId and positive quantity required" });
    }
    const result = stockDb.adminRemove(productId, planId, quantity, reason, actor || "admin");
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || "Failed to remove stock" });
  }
});

// src/server/authRouter.ts
import { Router as Router2 } from "express";
import crypto2 from "crypto";

// src/server/accountDb.ts
import fs2 from "fs";
import path2 from "path";

// src/server/adminAuth.ts
var ADMIN_TELEGRAM_IDS = /* @__PURE__ */ new Set([
  7638499069
  // ΛBYSSIПIΛ VΣПDOR (@abyssiniavendor)
]);
function isTelegramAdminId(telegramId) {
  return typeof telegramId === "number" && ADMIN_TELEGRAM_IDS.has(telegramId);
}
function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        error: "UNAUTHORIZED",
        message: "Telegram authentication required. Please access via the ATH Telegram Bot."
      });
      return;
    }
    const token = authHeader.replace("Bearer ", "").trim();
    const session = sessionStore.getSession(token);
    if (!session) {
      res.status(401).json({
        success: false,
        error: "SESSION_EXPIRED",
        message: "Session expired. Please reconnect from Telegram."
      });
      return;
    }
    if (!isTelegramAdminId(session.telegramId)) {
      console.warn(`[Security] Unauthorized /admin access attempt by Telegram ID: ${session.telegramId}`);
      res.status(403).json({
        success: false,
        error: "FORBIDDEN",
        message: "Access denied: Telegram User ID is not authorized for administrative access."
      });
      return;
    }
    const account = accountDb.getByTelegramId(session.telegramId);
    req.adminAccount = account;
    req.adminTelegramId = session.telegramId;
    next();
  } catch (err) {
    console.error("[AdminAuth] Exception in requireAdmin middleware:", err);
    res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: "Internal authorization error."
    });
  }
}

// src/server/accountDb.ts
var DATA_DIR2 = path2.resolve(process.cwd(), "data");
var ACCOUNTS_DB_PATH = path2.resolve(DATA_DIR2, "accounts-db.json");
var AccountDatabase = class {
  constructor() {
    this.accountsMap = /* @__PURE__ */ new Map();
    this.isLoaded = false;
  }
  getDbPath() {
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      const tmpDir = path2.resolve("/tmp", "ath_data");
      try {
        if (!fs2.existsSync(tmpDir)) {
          fs2.mkdirSync(tmpDir, { recursive: true });
        }
        return path2.resolve(tmpDir, "accounts-db.json");
      } catch {
      }
    }
    return ACCOUNTS_DB_PATH;
  }
  ensureDataDir() {
    try {
      if (!fs2.existsSync(DATA_DIR2)) {
        fs2.mkdirSync(DATA_DIR2, { recursive: true });
      }
    } catch {
    }
  }
  loadFromDisk() {
    this.ensureDataDir();
    const activePath = this.getDbPath();
    try {
      const targetPath = fs2.existsSync(activePath) ? activePath : fs2.existsSync(ACCOUNTS_DB_PATH) ? ACCOUNTS_DB_PATH : null;
      if (targetPath) {
        const raw = fs2.readFileSync(targetPath, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.accountsMap.clear();
          for (const acc of parsed) {
            if (acc && typeof acc.telegramId === "number") {
              this.accountsMap.set(acc.telegramId, acc);
            }
          }
          console.log(`[AccountDb] Loaded ${this.accountsMap.size} user accounts from disk (${targetPath})`);
        }
      }
    } catch (err) {
      console.warn("[AccountDb] Failed to load accounts from disk, starting empty:", err);
    }
    const adminTelegramId = 7638499069;
    const existingAdmin = this.accountsMap.get(adminTelegramId);
    if (!existingAdmin) {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const adminAccount = {
        id: `ath_${adminTelegramId}`,
        telegramId: adminTelegramId,
        firstName: "\u039BBYSSI\u041FI\u039B",
        lastName: "V\u03A3\u041FDOR",
        username: "abyssiniavendor",
        languageCode: "en",
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
        status: "active",
        role: "admin",
        orderCount: 0,
        totalSpentETB: 0
      };
      this.accountsMap.set(adminTelegramId, adminAccount);
      this.saveToDisk();
      console.log(`[AccountDb] Seeded primary admin account for Telegram ID: ${adminTelegramId} (\u039BBYSSI\u041FI\u039B V\u03A3\u041FDOR)`);
    } else if (existingAdmin.role !== "admin") {
      existingAdmin.role = "admin";
      this.saveToDisk();
    }
    this.isLoaded = true;
  }
  saveToDisk() {
    this.ensureDataDir();
    const targetPath = this.getDbPath();
    try {
      const accountsList = Array.from(this.accountsMap.values());
      const tempPath = `${targetPath}.tmp`;
      fs2.writeFileSync(tempPath, JSON.stringify(accountsList, null, 2), "utf-8");
      fs2.renameSync(tempPath, targetPath);
    } catch (err) {
      console.warn("[AccountDb] Failed to persist accounts to disk:", err);
    }
  }
  init() {
    if (!this.isLoaded) {
      this.loadFromDisk();
    }
  }
  getByTelegramId(telegramId) {
    this.init();
    return this.accountsMap.get(telegramId) || null;
  }
  getById(id) {
    this.init();
    for (const acc of this.accountsMap.values()) {
      if (acc.id === id) return acc;
    }
    return null;
  }
  getAll() {
    this.init();
    return Array.from(this.accountsMap.values());
  }
  /**
   * Automatically creates an ATH account on first visit, or loads and updates
   * the existing account on returning visits using the permanent Telegram User ID.
   */
  upsertTelegramAccount(payload) {
    this.init();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const existing = this.accountsMap.get(payload.id);
    const isAdmin = isTelegramAdminId(payload.id);
    if (existing) {
      const updated = {
        ...existing,
        firstName: payload.first_name || existing.firstName,
        lastName: payload.last_name !== void 0 ? payload.last_name : existing.lastName,
        username: payload.username !== void 0 ? payload.username : existing.username,
        photoUrl: payload.photo_url !== void 0 ? payload.photo_url : existing.photoUrl,
        languageCode: payload.language_code || existing.languageCode,
        role: isAdmin ? "admin" : existing.role,
        // Telegram User ID is the security authority
        updatedAt: now,
        lastLoginAt: now
      };
      this.accountsMap.set(payload.id, updated);
      this.saveToDisk();
      return { account: updated, isNew: false };
    }
    const newAccount = {
      id: `ath_${payload.id}`,
      telegramId: payload.id,
      // Permanent account identifier
      firstName: payload.first_name || (isAdmin ? "\u039BBYSSI\u041FI\u039B" : "Trader"),
      lastName: payload.last_name || (isAdmin ? "V\u03A3\u041FDOR" : void 0),
      username: payload.username || (isAdmin ? "abyssiniavendor" : void 0),
      photoUrl: payload.photo_url || void 0,
      languageCode: payload.language_code || "en",
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
      status: "active",
      role: isAdmin ? "admin" : "customer",
      orderCount: 0,
      totalSpentETB: 0
    };
    this.accountsMap.set(payload.id, newAccount);
    this.saveToDisk();
    console.log(`[AccountDb] Created new ATH account for Telegram ID: ${payload.id} (@${payload.username || "unknown"})`);
    return { account: newAccount, isNew: true };
  }
};
var accountDb = new AccountDatabase();

// src/server/authTelegram.ts
import crypto from "crypto";
var DEFAULT_MAX_AUTH_AGE_SECONDS = 86400;
var MAX_ALLOWED_CLOCK_SKEW_SECONDS = 300;
var DEFAULT_DEV_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "ATH_TELEGRAM_BOT_DEFAULT_SECRET_2026";
function getAuthErrorMessage(errorCode) {
  switch (errorCode) {
    case "MISSING_INIT_DATA":
      return "Missing Telegram launch data. Please launch ATH directly from the Telegram bot.";
    case "EXPIRED_INIT_DATA":
      return "Telegram authentication session expired. Please reopen ATH from Telegram.";
    case "INVALID_TELEGRAM_SIGNATURE":
    case "MISSING_HASH":
      return "Invalid Telegram verification signature. The launch data could not be verified.";
    case "FUTURE_AUTH_DATE":
    case "INVALID_AUTH_DATE":
    case "MISSING_AUTH_DATE":
      return "Invalid authentication timestamp. Please check your device clock.";
    case "MISSING_BOT_CREDENTIALS":
      return "Server bot credentials not configured. Please contact ATH support.";
    case "MALFORMED_USER_PAYLOAD":
    case "MISSING_USER_PAYLOAD":
    case "INVALID_USER_ID":
      return "Malformed Telegram user profile. Please reopen ATH from Telegram.";
    case "NETWORK_ERROR":
      return "Server connection error. Please check your network and retry.";
    case "SERVER_ERROR":
      return "Server error during authentication. Please retry in a few moments.";
    default:
      return "Unable to verify your Telegram account. Please reopen ATH from Telegram.";
  }
}
function validateTelegramInitData(initData, botToken, options) {
  if (!initData || typeof initData !== "string") {
    return { valid: false, error: "MISSING_INIT_DATA" };
  }
  const effectiveToken = botToken !== void 0 ? botToken : process.env.TELEGRAM_BOT_TOKEN || DEFAULT_DEV_BOT_TOKEN;
  if (!effectiveToken || typeof effectiveToken !== "string" || effectiveToken.trim() === "") {
    return { valid: false, error: "MISSING_BOT_CREDENTIALS" };
  }
  try {
    let cleanInitData = initData.trim();
    if (cleanInitData.startsWith("#")) {
      cleanInitData = cleanInitData.slice(1);
    }
    if (cleanInitData.startsWith("tgWebAppData=")) {
      cleanInitData = cleanInitData.slice("tgWebAppData=".length);
    }
    if (!cleanInitData.includes("&") && cleanInitData.includes("%")) {
      try {
        cleanInitData = decodeURIComponent(cleanInitData);
      } catch {
      }
    }
    const params = new URLSearchParams(cleanInitData);
    let hash = params.get("hash");
    if (!hash && cleanInitData.includes("%")) {
      try {
        const decoded = decodeURIComponent(cleanInitData);
        const secondParams = new URLSearchParams(decoded);
        if (secondParams.has("hash")) {
          cleanInitData = decoded;
          params.forEach((_, k) => params.delete(k));
          secondParams.forEach((v, k) => params.set(k, v));
          hash = secondParams.get("hash");
        }
      } catch {
      }
    }
    if (!hash) {
      return { valid: false, error: "MISSING_HASH" };
    }
    if (!/^[0-9a-f]{64}$/i.test(hash)) {
      return { valid: false, error: "INVALID_TELEGRAM_SIGNATURE" };
    }
    const userJson = params.get("user");
    if (!userJson) {
      return { valid: false, error: "MISSING_USER_PAYLOAD" };
    }
    let user;
    try {
      user = JSON.parse(userJson);
      if (!user || typeof user.id !== "number" || user.id <= 0) {
        return { valid: false, error: "INVALID_USER_ID" };
      }
    } catch {
      return { valid: false, error: "MALFORMED_USER_PAYLOAD" };
    }
    const authDateStr = params.get("auth_date");
    if (!authDateStr) {
      return { valid: false, error: "MISSING_AUTH_DATE" };
    }
    const authDate = parseInt(authDateStr, 10);
    if (isNaN(authDate) || authDate <= 0) {
      return { valid: false, error: "INVALID_AUTH_DATE" };
    }
    const nowSec = options?.currentTimestamp ?? Math.floor(Date.now() / 1e3);
    const maxAge = options?.maxAgeSeconds ?? DEFAULT_MAX_AUTH_AGE_SECONDS;
    if (nowSec - authDate > maxAge) {
      return { valid: false, error: "EXPIRED_INIT_DATA" };
    }
    if (authDate - nowSec > MAX_ALLOWED_CLOCK_SKEW_SECONDS) {
      return { valid: false, error: "FUTURE_AUTH_DATE" };
    }
    params.delete("hash");
    const sortedKeys = Array.from(params.keys()).sort((a, b) => a.localeCompare(b));
    const dataCheckString = sortedKeys.map((key) => `${key}=${params.get(key)}`).join("\n");
    const secretKey = crypto.createHmac("sha256", "WebAppData").update(effectiveToken).digest();
    const calculatedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
    const hashBuf = Buffer.from(hash, "hex");
    const calculatedBuf = Buffer.from(calculatedHash, "hex");
    if (hashBuf.length !== calculatedBuf.length || !crypto.timingSafeEqual(hashBuf, calculatedBuf)) {
      return { valid: false, error: "INVALID_TELEGRAM_SIGNATURE" };
    }
    return {
      valid: true,
      user,
      authDate
    };
  } catch (err) {
    console.error("[AuthTelegram] Verification exception:", err);
    return { valid: false, error: "VALIDATION_FAILED" };
  }
}
function generateSignedInitData(user, botToken = DEFAULT_DEV_BOT_TOKEN, customAuthDate) {
  const authDate = customAuthDate !== void 0 ? customAuthDate : Math.floor(Date.now() / 1e3);
  const userJson = JSON.stringify(user);
  const params = {
    auth_date: authDate.toString(),
    query_id: "ATH_DEV_QUERY_" + Date.now(),
    user: userJson
  };
  const sortedKeys = Object.keys(params).sort((a, b) => a.localeCompare(b));
  const dataCheckString = sortedKeys.map((k) => `${k}=${params[k]}`).join("\n");
  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const hash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  const searchParams = new URLSearchParams();
  for (const key of sortedKeys) {
    searchParams.set(key, params[key]);
  }
  searchParams.set("hash", hash);
  return searchParams.toString();
}

// src/server/authRouter.ts
var authRouter = Router2();
var activeSessions = /* @__PURE__ */ new Map();
function generateSessionToken() {
  return "ath_sess_" + crypto2.randomBytes(24).toString("hex");
}
var sessionStore = {
  createSession(telegramId, ttlMs = 30 * 24 * 60 * 60 * 1e3) {
    const token = generateSessionToken();
    const now = Date.now();
    const expiresAt = now + ttlMs;
    activeSessions.set(token, { telegramId, expiresAt, createdAt: now });
    return { token, expiresAt };
  },
  getSession(token) {
    if (!token) return null;
    const session = activeSessions.get(token);
    if (!session) return null;
    if (session.expiresAt < Date.now()) {
      activeSessions.delete(token);
      return null;
    }
    return session;
  },
  revokeSession(token) {
    if (!token) return false;
    return activeSessions.delete(token);
  },
  revokeAllSessionsForTelegramId(telegramId) {
    let count = 0;
    for (const [token, data] of activeSessions.entries()) {
      if (data.telegramId === telegramId) {
        activeSessions.delete(token);
        count++;
      }
    }
    return count;
  },
  cleanupExpired() {
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
  clearAll() {
    activeSessions.clear();
  },
  getActiveCount() {
    return activeSessions.size;
  }
};
authRouter.post("/telegram", (req, res) => {
  try {
    const { initData } = req.body;
    if (!initData || typeof initData !== "string") {
      res.status(400).json({
        success: false,
        error: "MISSING_INIT_DATA",
        message: getAuthErrorMessage("MISSING_INIT_DATA")
      });
      return;
    }
    const validation = validateTelegramInitData(initData);
    if (!validation.valid || !validation.user) {
      const errorCode = validation.error || "UNVERIFIED_TELEGRAM_SESSION";
      console.warn("[AuthRouter] Telegram verification failed:", errorCode);
      const statusCode = errorCode === "MISSING_INIT_DATA" ? 400 : 401;
      res.status(statusCode).json({
        success: false,
        error: errorCode,
        message: getAuthErrorMessage(errorCode)
      });
      return;
    }
    const { account, isNew } = accountDb.upsertTelegramAccount(validation.user);
    const { token, expiresAt } = sessionStore.createSession(account.telegramId);
    res.status(200).json({
      success: true,
      account,
      token,
      expiresAt,
      isNew
    });
  } catch (err) {
    console.error("[AuthRouter] Error in /telegram auth:", err);
    res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: getAuthErrorMessage("SERVER_ERROR")
    });
  }
});
authRouter.get("/me", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ success: false, error: "NO_TOKEN" });
      return;
    }
    const token = authHeader.replace("Bearer ", "").trim();
    const session = sessionStore.getSession(token);
    if (!session) {
      res.status(401).json({ success: false, error: "SESSION_EXPIRED" });
      return;
    }
    const account = accountDb.getByTelegramId(session.telegramId);
    if (!account) {
      res.status(404).json({ success: false, error: "ACCOUNT_NOT_FOUND" });
      return;
    }
    res.status(200).json({
      success: true,
      account
    });
  } catch (err) {
    console.error("[AuthRouter] Error in /me:", err);
    res.status(500).json({ success: false, error: "SERVER_ERROR" });
  }
});
authRouter.post("/logout", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(400).json({ success: false, error: "NO_TOKEN" });
      return;
    }
    const token = authHeader.replace("Bearer ", "").trim();
    const revoked = sessionStore.revokeSession(token);
    res.status(200).json({
      success: true,
      revoked,
      message: "Logged out successfully"
    });
  } catch (err) {
    console.error("[AuthRouter] Error in /logout:", err);
    res.status(500).json({ success: false, error: "SERVER_ERROR" });
  }
});
authRouter.get("/admin-check", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ success: false, authorized: false, error: "NO_TOKEN" });
      return;
    }
    const token = authHeader.replace("Bearer ", "").trim();
    const session = sessionStore.getSession(token);
    if (!session) {
      res.status(401).json({ success: false, authorized: false, error: "SESSION_EXPIRED" });
      return;
    }
    const authorized = isTelegramAdminId(session.telegramId);
    const account = accountDb.getByTelegramId(session.telegramId);
    res.status(200).json({
      success: true,
      authorized,
      role: authorized ? "admin" : "customer",
      telegramId: session.telegramId,
      account
    });
  } catch (err) {
    res.status(500).json({ success: false, authorized: false, error: "SERVER_ERROR" });
  }
});
authRouter.get("/preview-initdata", (req, res) => {
  try {
    const { simulate_error, simulate_expired, admin, as_admin } = req.query;
    if (simulate_error === "true" || simulate_error === "1") {
      res.status(200).json({
        success: true,
        initData: "invalid_tampered_preview_hash"
      });
      return;
    }
    const isAdminSim = admin === "true" || admin === "1" || as_admin === "true" || as_admin === "1";
    const previewUser = isAdminSim ? {
      id: 7638499069,
      first_name: "\u039BBYSSI\u041FI\u039B",
      last_name: "V\u03A3\u041FDOR",
      username: "abyssiniavendor",
      language_code: "en"
    } : {
      id: 984572019,
      first_name: "Dave",
      last_name: "Alf",
      username: "davealf436",
      language_code: "en"
    };
    const customAuthDate = simulate_expired === "true" || simulate_expired === "1" ? Math.floor(Date.now() / 1e3) - 48 * 3600 : void 0;
    const signedInitData = generateSignedInitData(previewUser, void 0, customAuthDate);
    res.status(200).json({
      success: true,
      initData: signedInitData,
      user: previewUser,
      expired: Boolean(customAuthDate)
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "FAILED_TO_GENERATE_PREVIEW" });
  }
});

// src/server/adminRouter.ts
import { Router as Router3 } from "express";
var adminRouter = Router3();
adminRouter.use(requireAdmin);
adminRouter.get("/verify", (req, res) => {
  const telegramId = req.adminTelegramId;
  const account = req.adminAccount || accountDb.getByTelegramId(telegramId);
  res.status(200).json({
    success: true,
    authorized: true,
    role: "admin",
    telegramId,
    account,
    message: "Authenticated as ATH Administrator"
  });
});

// src/server/apiEntry.ts
var app = express();
app.use(express.json());
app.use("/api/stock", stockRouter);
app.use("/stock", stockRouter);
app.use("/api/auth", authRouter);
app.use("/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/admin", adminRouter);
var BUILD_VERSION = "2026.10.11-v5";
app.get(["/api/health", "/health"], (_req, res) => {
  res.json({ status: "ok", service: "ATH Store API", version: BUILD_VERSION });
});
app.get(["/api/version", "/version"], (_req, res) => {
  res.json({
    version: BUILD_VERSION,
    timestamp: Date.now(),
    service: "ATH Store Mini App"
  });
});
app.get(["/", "/api"], (_req, res) => {
  res.json({ status: "ok", service: "ATH Store API", version: BUILD_VERSION });
});
function handler(req, res) {
  return app(req, res);
}
export {
  app,
  handler as default
};
