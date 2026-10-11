import { AthAccount } from '../types';
import { getTelegramWebApp, initTelegramApp } from './telegram';

export type AuthState = 'loading' | 'authenticated' | 'error';

const AUTH_TOKEN_KEY = 'ath_auth_token_v1';
const AUTH_ACCOUNT_KEY = 'ath_account_v1';
const AUTH_EVENT = 'ath_auth_state_changed';

let currentAuthState: AuthState = 'loading';
let currentAccount: AthAccount | null = (() => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(AUTH_ACCOUNT_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
  }
  return null;
})();
let currentAuthError: string | null = null;
let initPromise: Promise<boolean> | null = null;

function notifyListeners() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(AUTH_EVENT, {
        detail: {
          state: currentAuthState,
          account: currentAccount,
          error: currentAuthError,
        },
      })
    );
  }
}

/**
 * Extracts raw initData from Telegram WebApp SDK, URL hash, or URL search query.
 */
function extractTelegramInitData(): string {
  const tg = getTelegramWebApp();
  if (tg?.initData && typeof tg.initData === 'string' && tg.initData.trim() !== '') {
    return tg.initData.trim();
  }

  if (typeof window !== 'undefined') {
    // 1. Check URL hash (e.g. #tgWebAppData=... or hash with tgWebAppData key)
    if (window.location.hash) {
      const hashContent = window.location.hash.replace(/^#/, '');
      const hashParams = new URLSearchParams(hashContent);
      const fromHash = hashParams.get('tgWebAppData');
      if (fromHash) return fromHash;
      if (hashParams.has('hash') && (hashParams.has('user') || hashParams.has('auth_date'))) {
        return hashContent;
      }
    }

    // 2. Check URL search query (e.g. ?tgWebAppData=...)
    if (window.location.search) {
      const searchParams = new URLSearchParams(window.location.search);
      const fromSearch = searchParams.get('tgWebAppData');
      if (fromSearch) return fromSearch;
      if (searchParams.has('hash') && (searchParams.has('user') || searchParams.has('auth_date'))) {
        return window.location.search.replace(/^\?/, '');
      }
    }
  }

  return '';
}

/**
 * Automatically authenticates the Telegram Mini App user with the backend.
 */
export async function initAuth(): Promise<boolean> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    currentAuthState = 'loading';
    currentAuthError = null;
    notifyListeners();

    try {
      // Ensure Telegram WebApp environment is ready
      initTelegramApp();

      let initData = extractTelegramInitData();

      // Check if simulation query parameter requested error state for testing
      let simulateMissing = false;
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('auth_missing') === '1' || urlParams.get('auth_missing') === 'true') {
          simulateMissing = true;
          initData = '';
        } else if (urlParams.get('auth_error') === '1' || urlParams.get('auth_error') === 'true') {
          initData = 'user=%7B%22id%22%3A999999999%7D&auth_date=1728639000&hash=0000000000000000000000000000000000000000000000000000000000000000';
        } else if (urlParams.get('auth_expired') === '1' || urlParams.get('auth_expired') === 'true') {
          initData = 'user=%7B%22id%22%3A999999999%7D&auth_date=1600000000&hash=0000000000000000000000000000000000000000000000000000000000000000';
        }
      }

      // If running in browser preview outside native Telegram, get preview signed initData
      if (!initData && !simulateMissing) {
        try {
          const previewRes = await fetch('/api/auth/preview-initdata');
          if (previewRes.ok) {
            const previewData = await previewRes.json();
            if (previewData.success && previewData.initData) {
              initData = previewData.initData;
            }
          }
        } catch {
          // continue with empty
        }
      }

      if (!initData) {
        currentAuthState = 'error';
        currentAuthError = 'Missing Telegram launch data. Please launch ATH directly from the Telegram bot.';
        currentAccount = null;
        notifyListeners();
        return false;
      }

      // Send initData to backend for HMAC-SHA256 validation
      let response: Response;
      try {
        response = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ initData }),
        });
      } catch (netErr) {
        console.warn('[AuthService] Network error reaching /api/auth/telegram:', netErr);
        currentAuthState = 'error';
        currentAuthError = 'Server connection error. Please check your network and retry.';
        currentAccount = null;
        notifyListeners();
        return false;
      }

      if (!response.ok) {
        let errorData: any = null;
        try {
          errorData = await response.json();
        } catch {}

        currentAuthState = 'error';
        if (errorData?.message) {
          currentAuthError = errorData.message;
        } else if (response.status === 405 || response.status === 404 || response.status >= 500) {
          currentAuthError = `Server connection error (${response.status}). Please check your network and retry.`;
        } else {
          currentAuthError = 'Unable to verify your Telegram account. Please reopen ATH from Telegram.';
        }

        currentAccount = null;
        try {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(AUTH_ACCOUNT_KEY);
        } catch {}
        notifyListeners();
        return false;
      }

      const data = await response.json().catch(() => null);

      if (data && data.success && data.account) {
        currentAuthState = 'authenticated';
        currentAccount = data.account;
        currentAuthError = null;

        if (typeof window !== 'undefined') {
          try {
            if (data.token) {
              localStorage.setItem(AUTH_TOKEN_KEY, data.token);
            }
            localStorage.setItem(AUTH_ACCOUNT_KEY, JSON.stringify(data.account));
          } catch {}
        }

        notifyListeners();
        return true;
      }

      currentAuthState = 'error';
      currentAuthError = data?.message || 'Unable to verify your Telegram account. Please reopen ATH from Telegram.';
      currentAccount = null;
      notifyListeners();
      return false;
    } catch (err) {
      console.error('[AuthService] Authentication error:', err);
      currentAuthState = 'error';
      currentAuthError = 'Server connection error. Please check your network and retry.';
      currentAccount = null;
      notifyListeners();
      return false;
    }
  })();

  return initPromise;
}

export function retryAuth(): Promise<boolean> {
  initPromise = null;
  initTelegramApp();
  return initAuth();
}

export function getAuthState(): AuthState {
  return currentAuthState;
}

export function getCurrentAccount(): AthAccount | null {
  return currentAccount;
}

export function getAuthError(): string | null {
  return currentAuthError;
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {}
  }
  return null;
}

export function subscribeToAuth(
  callback: (state: AuthState, account: AthAccount | null, error: string | null) => void
): () => void {
  const handler = (e: Event) => {
    const custom = e as CustomEvent<{
      state: AuthState;
      account: AthAccount | null;
      error: string | null;
    }>;
    if (custom.detail) {
      callback(custom.detail.state, custom.detail.account, custom.detail.error);
    } else {
      callback(currentAuthState, currentAccount, currentAuthError);
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener(AUTH_EVENT, handler);
    return () => window.removeEventListener(AUTH_EVENT, handler);
  }
  return () => {};
}

/**
 * Logs out the user by invalidating the session on the backend and clearing local storage.
 */
export async function logout(): Promise<void> {
  const token = getAuthToken();
  if (token) {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      console.warn('[AuthService] Logout request failed:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_ACCOUNT_KEY);
    } catch {}
  }

  currentAuthState = 'error';
  currentAccount = null;
  currentAuthError = 'Logged out. Please reopen ATH from Telegram.';
  initPromise = null;
  notifyListeners();
}

// Auto-initialize authentication on app load
if (typeof window !== 'undefined') {
  initAuth();
}
