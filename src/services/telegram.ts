import { TelegramUser } from '../types';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe?: {
          user?: TelegramUser;
          query_id?: string;
          auth_date?: number;
          hash?: string;
        };
        version?: string;
        platform?: string;
        colorScheme?: 'dark' | 'light';
        themeParams?: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        isExpanded?: boolean;
        viewportHeight?: number;
        viewportStableHeight?: number;
        headerColor?: string;
        backgroundColor?: string;
        setHeaderColor?: (color: string) => void;
        setBackgroundColor?: (color: string) => void;
        BackButton?: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        MainButton?: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
        };
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        enableClosingConfirmation?: () => void;
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
        openTelegramLink: (url: string) => void;
        sendData: (data: string) => void;
      };
    };
  }
}

export const isTelegramWebApp = (): boolean => {
  return typeof window !== 'undefined' && Boolean(window.Telegram?.WebApp?.initData);
};

/**
 * Authoritative Telegram User IDs with administrative access rights.
 * Security Authority: Permanent numeric Telegram User ID (not mutable usernames).
 */
export const ADMIN_TELEGRAM_IDS: ReadonlySet<number> = new Set<number>([
  7638499069, // ΛBYSSIПIΛ VΣПDOR (@abyssiniavendor)
]);

/**
 * Evaluates whether a Telegram user or ID is an authorized ATH admin.
 */
export const isTelegramAdmin = (userOrId?: TelegramUser | number | null): boolean => {
  if (!userOrId) return false;
  const id = typeof userOrId === 'number' ? userOrId : userOrId.id;
  return typeof id === 'number' && ADMIN_TELEGRAM_IDS.has(id);
};

export const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

export const initTelegramApp = () => {
  const tg = getTelegramWebApp();
  if (tg) {
    try {
      tg.ready();
      tg.expand();
      if (typeof tg.setHeaderColor === 'function') {
        tg.setHeaderColor('#FFFFFF');
      } else if (tg.headerColor) {
        tg.headerColor = '#FFFFFF';
      }
      if (typeof tg.setBackgroundColor === 'function') {
        tg.setBackgroundColor('#F8FAFC');
      } else if (tg.backgroundColor) {
        tg.backgroundColor = '#F8FAFC';
      }
      if (typeof tg.enableClosingConfirmation === 'function') {
        tg.enableClosingConfirmation();
      }
    } catch (e) {
      console.warn('Telegram WebApp init warning:', e);
    }
  }
};

export const getInitialTelegramUser = (): TelegramUser => {
  const tg = getTelegramWebApp();
  if (tg?.initDataUnsafe?.user) {
    return tg.initDataUnsafe.user;
  }
  // Default fallback user for browser/preview mode
  return {
    id: 984572019,
    first_name: 'Dave',
    last_name: 'Alf',
    username: 'davealf436',
    language_code: 'en',
  };
};

export const triggerHaptic = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') => {
  const tg = getTelegramWebApp();
  if (tg?.HapticFeedback) {
    try {
      tg.HapticFeedback.impactOccurred(style);
    } catch {
      // Haptics not supported or blocked
    }
  }
};

export const triggerNotificationHaptic = (type: 'error' | 'success' | 'warning' = 'success') => {
  const tg = getTelegramWebApp();
  if (tg?.HapticFeedback) {
    try {
      tg.HapticFeedback.notificationOccurred(type);
    } catch {
      // Haptics not supported or blocked
    }
  }
};

export const shareToTelegram = (text: string, url: string) => {
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  const tg = getTelegramWebApp();
  if (tg?.openTelegramLink) {
    tg.openTelegramLink(shareUrl);
  } else if (tg?.openLink) {
    tg.openLink(shareUrl);
  } else if (typeof window !== 'undefined') {
    const a = document.createElement('a');
    a.href = shareUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

export const openTelegramSupport = (username: string = 'abyssiniavendor') => {
  const cleanUsername = username.replace('@', '');
  const url = `https://t.me/${cleanUsername}`;
  const tg = getTelegramWebApp();
  if (tg?.openTelegramLink) {
    tg.openTelegramLink(url);
  } else if (tg?.openLink) {
    tg.openLink(url);
  } else if (typeof window !== 'undefined') {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};
