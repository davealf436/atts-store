import crypto from 'crypto';
import { TelegramUserPayload } from './accountDb';

export interface TelegramAuthValidationResult {
  valid: boolean;
  user?: TelegramUserPayload;
  authDate?: number;
  error?: string;
}

export interface TelegramAuthOptions {
  maxAgeSeconds?: number;
  currentTimestamp?: number;
}

export const DEFAULT_MAX_AUTH_AGE_SECONDS = 86400; // 24 hours (standard Telegram WebApp recommendation)
export const MAX_ALLOWED_CLOCK_SKEW_SECONDS = 300; // 5 minutes future tolerance

const DEFAULT_DEV_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'ATH_TELEGRAM_BOT_DEFAULT_SECRET_2026';

/**
 * Validates Telegram Mini App initData on the backend using HMAC-SHA256 signature verification.
 * Follows the official Telegram WebApp authentication protocol.
 * Enforces cryptographic authenticity, tamper-proofing, and freshness of auth_date.
 */
export function validateTelegramInitData(
  initData: string,
  botToken: string = DEFAULT_DEV_BOT_TOKEN,
  options?: TelegramAuthOptions
): TelegramAuthValidationResult {
  if (!initData || typeof initData !== 'string') {
    return { valid: false, error: 'MISSING_INIT_DATA' };
  }

  if (!botToken || typeof botToken !== 'string' || botToken.trim() === '') {
    return { valid: false, error: 'MISSING_BOT_CREDENTIALS' };
  }

  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');

    if (!hash) {
      return { valid: false, error: 'MISSING_HASH' };
    }

    // Hash must be 64 hexadecimal characters for SHA-256
    if (!/^[0-9a-f]{64}$/i.test(hash)) {
      return { valid: false, error: 'INVALID_TELEGRAM_SIGNATURE' };
    }

    // Extract user JSON string
    const userJson = params.get('user');
    if (!userJson) {
      return { valid: false, error: 'MISSING_USER_PAYLOAD' };
    }

    let user: TelegramUserPayload;
    try {
      user = JSON.parse(userJson);
      if (!user || typeof user.id !== 'number' || user.id <= 0) {
        return { valid: false, error: 'INVALID_USER_ID' };
      }
    } catch {
      return { valid: false, error: 'MALFORMED_USER_PAYLOAD' };
    }

    // Verify auth_date existence and validity
    const authDateStr = params.get('auth_date');
    if (!authDateStr) {
      return { valid: false, error: 'MISSING_AUTH_DATE' };
    }
    const authDate = parseInt(authDateStr, 10);
    if (isNaN(authDate) || authDate <= 0) {
      return { valid: false, error: 'INVALID_AUTH_DATE' };
    }

    // Enforce auth_date freshness to prevent replay attacks and stale authentication data
    const nowSec = options?.currentTimestamp ?? Math.floor(Date.now() / 1000);
    const maxAge = options?.maxAgeSeconds ?? DEFAULT_MAX_AUTH_AGE_SECONDS;

    if (nowSec - authDate > maxAge) {
      return { valid: false, error: 'EXPIRED_INIT_DATA' };
    }

    if (authDate - nowSec > MAX_ALLOWED_CLOCK_SKEW_SECONDS) {
      return { valid: false, error: 'FUTURE_AUTH_DATE' };
    }

    // Construct data-check-string (all params sorted alphabetically except hash)
    params.delete('hash');
    const sortedKeys = Array.from(params.keys()).sort((a, b) => a.localeCompare(b));
    const dataCheckString = sortedKeys
      .map((key) => `${key}=${params.get(key)}`)
      .join('\n');

    // Calculate HMAC-SHA256:
    // secret_key = HMAC_SHA256("WebAppData", botToken)
    // calculated_hash = HMAC_SHA256(secret_key, dataCheckString)
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    // Secure timing-safe comparison to prevent timing attacks
    const hashBuf = Buffer.from(hash, 'hex');
    const calculatedBuf = Buffer.from(calculatedHash, 'hex');

    if (hashBuf.length !== calculatedBuf.length || !crypto.timingSafeEqual(hashBuf, calculatedBuf)) {
      return { valid: false, error: 'INVALID_TELEGRAM_SIGNATURE' };
    }

    return {
      valid: true,
      user,
      authDate,
    };
  } catch (err) {
    console.error('[AuthTelegram] Verification exception:', err);
    return { valid: false, error: 'VALIDATION_FAILED' };
  }
}

/**
 * Generates valid HMAC-SHA256 signed initData for development/preview environments and testing.
 */
export function generateSignedInitData(
  user: TelegramUserPayload,
  botToken: string = DEFAULT_DEV_BOT_TOKEN,
  customAuthDate?: number
): string {
  const authDate = customAuthDate !== undefined ? customAuthDate : Math.floor(Date.now() / 1000);
  const userJson = JSON.stringify(user);

  const params: Record<string, string> = {
    auth_date: authDate.toString(),
    query_id: 'ATH_DEV_QUERY_' + Date.now(),
    user: userJson,
  };

  const sortedKeys = Object.keys(params).sort((a, b) => a.localeCompare(b));
  const dataCheckString = sortedKeys.map((k) => `${k}=${params[k]}`).join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const hash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  const searchParams = new URLSearchParams();
  for (const key of sortedKeys) {
    searchParams.set(key, params[key]);
  }
  searchParams.set('hash', hash);

  return searchParams.toString();
}
