import fs from 'fs';
import path from 'path';
import { AthAccount } from '../types';
import { isTelegramAdminId } from './adminAuth';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const ACCOUNTS_DB_PATH = path.resolve(DATA_DIR, 'accounts-db.json');

export interface TelegramUserPayload {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

class AccountDatabase {
  private accountsMap: Map<number, AthAccount> = new Map();
  private isLoaded = false;

  private getDbPath(): string {
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      const tmpDir = path.resolve('/tmp', 'ath_data');
      try {
        if (!fs.existsSync(tmpDir)) {
          fs.mkdirSync(tmpDir, { recursive: true });
        }
        return path.resolve(tmpDir, 'accounts-db.json');
      } catch {}
    }
    return ACCOUNTS_DB_PATH;
  }

  private ensureDataDir() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch {
      // Read-only filesystem in serverless environments
    }
  }

  private loadFromDisk() {
    this.ensureDataDir();
    const activePath = this.getDbPath();
    try {
      const targetPath = fs.existsSync(activePath) ? activePath : (fs.existsSync(ACCOUNTS_DB_PATH) ? ACCOUNTS_DB_PATH : null);
      if (targetPath) {
        const raw = fs.readFileSync(targetPath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.accountsMap.clear();
          for (const acc of parsed) {
            if (acc && typeof acc.telegramId === 'number') {
              this.accountsMap.set(acc.telegramId, acc);
            }
          }
          console.log(`[AccountDb] Loaded ${this.accountsMap.size} user accounts from disk (${targetPath})`);
        }
      }
    } catch (err) {
      console.warn('[AccountDb] Failed to load accounts from disk, starting empty:', err);
    }

    // Ensure authoritative primary ATH admin account exists and has role 'admin'
    const adminTelegramId = 7638499069;
    const existingAdmin = this.accountsMap.get(adminTelegramId);
    if (!existingAdmin) {
      const now = new Date().toISOString();
      const adminAccount: AthAccount = {
        id: `ath_${adminTelegramId}`,
        telegramId: adminTelegramId,
        firstName: 'ΛBYSSIПIΛ',
        lastName: 'VΣПDOR',
        username: 'abyssiniavendor',
        languageCode: 'en',
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
        status: 'active',
        role: 'admin',
        orderCount: 0,
        totalSpentETB: 0,
      };
      this.accountsMap.set(adminTelegramId, adminAccount);
      this.saveToDisk();
      console.log(`[AccountDb] Seeded primary admin account for Telegram ID: ${adminTelegramId} (ΛBYSSIПIΛ VΣПDOR)`);
    } else if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin';
      this.saveToDisk();
    }

    this.isLoaded = true;
  }

  private saveToDisk() {
    this.ensureDataDir();
    const targetPath = this.getDbPath();
    try {
      const accountsList = Array.from(this.accountsMap.values());
      const tempPath = `${targetPath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(accountsList, null, 2), 'utf-8');
      fs.renameSync(tempPath, targetPath);
    } catch (err) {
      console.warn('[AccountDb] Failed to persist accounts to disk:', err);
    }
  }

  private init() {
    if (!this.isLoaded) {
      this.loadFromDisk();
    }
  }

  public getByTelegramId(telegramId: number): AthAccount | null {
    this.init();
    return this.accountsMap.get(telegramId) || null;
  }

  public getById(id: string): AthAccount | null {
    this.init();
    for (const acc of this.accountsMap.values()) {
      if (acc.id === id) return acc;
    }
    return null;
  }

  public getAll(): AthAccount[] {
    this.init();
    return Array.from(this.accountsMap.values());
  }

  /**
   * Automatically creates an ATH account on first visit, or loads and updates
   * the existing account on returning visits using the permanent Telegram User ID.
   */
  public upsertTelegramAccount(payload: TelegramUserPayload): { account: AthAccount; isNew: boolean } {
    this.init();
    const now = new Date().toISOString();
    const existing = this.accountsMap.get(payload.id);
    const isAdmin = isTelegramAdminId(payload.id);

    if (existing) {
      // Returning user: update profile fields if changed, update lastLoginAt
      const updated: AthAccount = {
        ...existing,
        firstName: payload.first_name || existing.firstName,
        lastName: payload.last_name !== undefined ? payload.last_name : existing.lastName,
        username: payload.username !== undefined ? payload.username : existing.username,
        photoUrl: payload.photo_url !== undefined ? payload.photo_url : existing.photoUrl,
        languageCode: payload.language_code || existing.languageCode,
        role: isAdmin ? 'admin' : existing.role, // Telegram User ID is the security authority
        updatedAt: now,
        lastLoginAt: now,
      };

      this.accountsMap.set(payload.id, updated);
      this.saveToDisk();
      return { account: updated, isNew: false };
    }

    // First visit: automatically create new permanent ATH account
    const newAccount: AthAccount = {
      id: `ath_${payload.id}`,
      telegramId: payload.id, // Permanent account identifier
      firstName: payload.first_name || (isAdmin ? 'ΛBYSSIПIΛ' : 'Trader'),
      lastName: payload.last_name || (isAdmin ? 'VΣПDOR' : undefined),
      username: payload.username || (isAdmin ? 'abyssiniavendor' : undefined),
      photoUrl: payload.photo_url || undefined,
      languageCode: payload.language_code || 'en',
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
      status: 'active',
      role: isAdmin ? 'admin' : 'customer',
      orderCount: 0,
      totalSpentETB: 0,
    };

    this.accountsMap.set(payload.id, newAccount);
    this.saveToDisk();
    console.log(`[AccountDb] Created new ATH account for Telegram ID: ${payload.id} (@${payload.username || 'unknown'})`);
    return { account: newAccount, isNew: true };
  }
}

export const accountDb = new AccountDatabase();
