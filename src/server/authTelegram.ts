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

export function getAuthErrorMessage(errorCode?: string): string {
  switch (errorCode) {
    case 'MISSING_INIT_DATA':
      return 'Missing Telegram launch data. Please launch ATH directly from the Telegram bot.';
    case 'EXPIRED_INIT_DATA':
      return 'Telegram authentication session expired. Please reopen ATH from Telegram.';
    case 'INVALID_TELEGRAM_SIGNATURE':
    case 'MISSING_HASH':
      return 'Invalid Telegram verification signature. The launch data could not be verified.';
    case 'FUTURE_AUTH_DATE':
    case 'INVALID_AUTH_DATE':
    case 'MISSING_AUTH_DATE':
      return 'Invalid authentication timestamp. Please check your device clock.';
    case 'MISSING_BOT_CREDENTIALS':
      return 'Server bot credentials not configured. Please contact ATH support.';
    case 'MALFORMED_USER_PAYLOAD':
    case 'MISSING_USER_PAYLOAD':
    case 'INVALID_USER_ID':
      return 'Malformed Telegram user profile. Please reopen ATH from Telegram.';
    case 'NETWORK_ERROR':
      return 'Server connection error. Please check your network and retry.';
    case 'SERVER_ERROR':
      return 'Server error during authentication. Please retry in a few moments.';
    default:
      return 'Unable to verify your Telegram account. Please reopen ATH from Telegram.';
  }
}

/**
 * Validates Telegram Mini App initData on the backend using HMAC-SHA256 signature verification.
 * Follows the official Telegram WebApp authentication protocol.
 * Enforces cryptographic authenticity, tamper-proofing, and freshness of auth_date.
 */
export function validateTelegramInitData(
  initData: string,
  botToken?: string,
  options?: TelegramAuthOptions
): TelegramAuthValidationResult {
  if (!initData || typeof initData !== 'string') {
    return { valid: false, error: 'MISSING_INIT_DATA' };
  }

  const effectiveToken = botToken !== undefined
    ? botToken
    : (process.env.TELEGRAM_BOT_TOKEN || DEFAULT_DEV_BOT_TOKEN);

  if (!effectiveToken || typeof effectiveToken !== 'string' || effectiveToken.trim() === '') {
    return { valid: false, error: 'MISSING_BOT_CREDENTIALS' };
  }

  try {
    let cleanInitData = initData.trim();
    if (cleanInitData.startsWith('#')) {
      cleanInitData = cleanInitData.slice(1);
    }
    if (cleanInitData.startsWith('tgWebAppData=')) {
      cleanInitData = cleanInitData.slice('tgWebAppData='.length);
    }
    if (!cleanInitData.includes('&') && cleanInitData.includes('%')) {
      try {
        cleanInitData = decodeURIComponent(cleanInitData);
      } catch {}
    }

    const params = new URLSearchParams(cleanInitData);
    let hash = params.get('hash');

    // If hash not found but string still contains encoded characters, attempt secondary decode
    if (!hash && cleanInitData.includes('%')) {
      try {
        const decoded = decodeURIComponent(cleanInitData);
        const secondParams = new URLSearchParams(decoded);
        if (secondParams.has('hash')) {
          cleanInitData = decoded;
          params.forEach((_, k) => params.delete(k));
          secondParams.forEach((v, k) => params.set(k, v));
          hash = secondParams.get('hash');
        }
      } catch {}
    }

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
    // secret_key = HMAC_SHA256("WebAppData", effectiveToken)
    // calculated_hash = HMAC_SHA256(secret_key, dataCheckString)
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(effectiveToken).digest();
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
