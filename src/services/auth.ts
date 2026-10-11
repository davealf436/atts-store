import { AthAccount } from '../types';
import { getTelegramWebApp } from './telegram';

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
 * Automatically authenticates the Telegram Mini App user with the backend.
 */
export async function initAuth(): Promise<boolean> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    currentAuthState = 'loading';
    currentAuthError = null;
    notifyListeners();

    try {
      const tg = getTelegramWebApp();
      let initData = tg?.initData || '';

      // Check if simulation query parameter requested error state for testing
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('auth_error') === '1' || urlParams.get('auth_error') === 'true') {
          initData = 'invalid_tampered_preview_signature';
        }
      }

      // If running in browser preview outside native Telegram, get preview signed initData
      if (!initData) {
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
        currentAuthError = 'Unable to connect your Telegram account. Please reopen ATH from Telegram.';
        notifyListeners();
        return false;
      }

      // Send initData to backend for HMAC-SHA256 validation
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        currentAuthState = 'error';
        currentAuthError =
          errorData.message || 'Unable to connect your Telegram account. Please reopen ATH from Telegram.';
        currentAccount = null;
        try {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(AUTH_ACCOUNT_KEY);
        } catch {}
        notifyListeners();
        return false;
      }

      const data = await response.json();

      if (data.success && data.account) {
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
      currentAuthError = 'Unable to connect your Telegram account. Please reopen ATH from Telegram.';
      notifyListeners();
      return false;
    } catch (err) {
      console.error('[AuthService] Authentication error:', err);
      currentAuthState = 'error';
      currentAuthError = 'Unable to connect your Telegram account. Please reopen ATH from Telegram.';
      notifyListeners();
      return false;
    }
  })();

  return initPromise;
}

export function retryAuth(): Promise<boolean> {
  initPromise = null;
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
