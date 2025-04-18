import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { AppState, Notification } from './types';

interface WindowsDisplaySettings {
  colorScheme: 'light' | 'dark' | 'system';
  textScale: number;
  contrast: string;
  reducedMotion: boolean;
}

const getWindowsDisplaySettings = (): WindowsDisplaySettings => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const devicePixelRatio = window.devicePixelRatio || 1;

  return {
    colorScheme: mediaQuery.matches ? 'dark' : 'light',
    textScale: devicePixelRatio,
    contrast: window.matchMedia('(prefers-contrast: more)').matches ? 'high' : 'normal',
    reducedMotion: prefersReducedMotion.matches
  };
};

const initialState: AppState = {
  theme: getWindowsDisplaySettings().colorScheme,
  sidebarCollapsed: false,
  notifications: [],
  systemStats: null,
  loading: false,
  error: null,
  displaySettings: getWindowsDisplaySettings(),
  fontSize: 1,
  reducedMotion: false,
  highContrast: false
};

export const useAppStore = create(
  persist(
    immer<AppState>((set) => ({
      ...initialState,

      setTheme: (theme: 'light' | 'dark' | 'system') => 
        set(state => {
          state.theme = theme;
        }),

      toggleSidebar: () => 
        set(state => {
          state.sidebarCollapsed = !state.sidebarCollapsed;
        }),

      addNotification: (notification: Notification) =>
        set(state => {
          state.notifications.unshift(notification);
          if (state.notifications.length > 100) {
            state.notifications.pop();
          }
        }),

      removeNotification: (id: string) =>
        set(state => {
          state.notifications = state.notifications.filter(n => n.id !== id);
        }),

      markNotificationAsRead: (id: string) =>
        set(state => {
          const notification = state.notifications.find(n => n.id === id);
          if (notification) {
            notification.read = true;
          }
        }),

      clearNotifications: () =>
        set(state => {
          state.notifications = [];
        }),

      setError: (error: string | null) =>
        set(state => {
          state.error = error;
        }),

      setLoading: (loading: boolean) =>
        set(state => {
          state.loading = loading;
        }),

      updateDisplaySettings: () =>
        set(state => {
          state.displaySettings = getWindowsDisplaySettings();
          state.theme = state.displaySettings.colorScheme;
          state.fontSize = state.displaySettings.textScale;
          state.reducedMotion = state.displaySettings.reducedMotion;
          state.highContrast = state.displaySettings.contrast === 'high';
        }),

      setFontSize: (size: number) =>
        set(state => {
          state.fontSize = size;
        }),

      toggleReducedMotion: () =>
        set(state => {
          state.reducedMotion = !state.reducedMotion;
        }),

      toggleHighContrast: () =>
        set(state => {
          state.highContrast = !state.highContrast;
        })
    })),
    {
      name: 'easy-helpdesk-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        notifications: state.notifications,
        fontSize: state.fontSize,
        reducedMotion: state.reducedMotion,
        highContrast: state.highContrast
      })
    }
  )
);

// Listen for Windows display settings changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    useAppStore.getState().updateDisplaySettings();
  });

  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
    useAppStore.getState().updateDisplaySettings();
  });

  window.matchMedia('(prefers-contrast: more)').addEventListener('change', () => {
    useAppStore.getState().updateDisplaySettings();
  });
}