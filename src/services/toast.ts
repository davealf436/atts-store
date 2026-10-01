import { triggerNotificationHaptic } from './telegram';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

let activeToasts: ToastItem[] = [];
const listeners: Set<ToastListener> = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener([...activeToasts]));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ath_toasts_changed', { detail: activeToasts }));
  }
};

export const dismissToast = (id: string) => {
  activeToasts = activeToasts.filter((t) => t.id !== id);
  notifyListeners();
};

export const showToast = (options: {
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
}): string => {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const type = options.type || 'success';
  const duration = options.duration ?? 4000;

  const newToast: ToastItem = {
    id,
    type,
    title: options.title,
    message: options.message,
    duration,
  };

  // Limit to at most 3 simultaneous toasts to prevent clutter
  activeToasts = [newToast, ...activeToasts].slice(0, 3);
  notifyListeners();

  // Haptic feedback
  if (type === 'error') {
    triggerNotificationHaptic('error');
  } else if (type === 'warning') {
    triggerNotificationHaptic('warning');
  } else {
    triggerNotificationHaptic('success');
  }

  // Auto-dismiss after duration
  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }

  return id;
};

export const subscribeToasts = (listener: ToastListener): (() => void) => {
  listeners.add(listener);
  listener([...activeToasts]);
  return () => {
    listeners.delete(listener);
  };
};

export const toast = {
  success: (title: string, message?: string, duration?: number) =>
    showToast({ type: 'success', title, message, duration }),
  info: (title: string, message?: string, duration?: number) =>
    showToast({ type: 'info', title, message, duration }),
  warning: (title: string, message?: string, duration?: number) =>
    showToast({ type: 'warning', title, message, duration }),
  error: (title: string, message?: string, duration?: number) =>
    showToast({ type: 'error', title, message, duration }),
  dismiss: dismissToast,
};
