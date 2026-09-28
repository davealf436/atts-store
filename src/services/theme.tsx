import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTelegramWebApp } from './telegram';

export type AppearanceMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  appearance: AppearanceMode;
  resolvedTheme: ResolvedTheme;
  setAppearance: (mode: AppearanceMode) => void;
}

const THEME_STORAGE_KEY = 'ath_appearance_theme';

const getSystemPreference = (): ResolvedTheme => {
  const tg = getTelegramWebApp();
  if (tg?.colorScheme === 'dark' || tg?.colorScheme === 'light') {
    return tg.colorScheme;
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const getInitialAppearance = (): AppearanceMode => {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as AppearanceMode | null;
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch {
    // Ignore storage access errors
  }
  return 'light';
};

const applyDocumentTheme = (resolved: ResolvedTheme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  
  if (resolved === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }

  // Sync Telegram WebApp top header and container colors
  const tg = getTelegramWebApp();
  if (tg) {
    try {
      const headerColor = resolved === 'dark' ? '#0F0F12' : '#F8F9FA';
      const bgColor = resolved === 'dark' ? '#0F0F12' : '#F8F9FA';
      tg.setHeaderColor?.(headerColor);
      tg.setBackgroundColor?.(bgColor);
    } catch {
      // Ignore Telegram theme synchronization errors
    }
  }
};

const ThemeContext = createContext<ThemeContextType>({
  appearance: 'light',
  resolvedTheme: 'light',
  setAppearance: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appearance, setAppearanceState] = useState<AppearanceMode>(getInitialAppearance);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemPreference);

  // Calculate effective resolved theme
  const resolvedTheme: ResolvedTheme = appearance === 'system' ? systemTheme : appearance;

  // Apply to document whenever resolvedTheme changes
  useEffect(() => {
    applyDocumentTheme(resolvedTheme);
  }, [resolvedTheme]);

  // Listen to OS system color scheme changes in real-time
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // Modern API with fallback
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const setAppearance = (mode: AppearanceMode) => {
    setAppearanceState(mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Ignore storage errors
    }
    const targetResolved = mode === 'system' ? getSystemPreference() : mode;
    applyDocumentTheme(targetResolved);
  };

  return (
    <ThemeContext.Provider value={{ appearance, resolvedTheme, setAppearance }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
