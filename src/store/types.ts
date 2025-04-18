import { z } from 'zod';

export const WindowsDisplaySettingsSchema = z.object({
  colorScheme: z.enum(['light', 'dark', 'system']),
  textScale: z.number(),
  contrast: z.string(),
  reducedMotion: z.boolean()
});

export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(3, 'שם המשתמש חייב להכיל לפחות 3 תווים'),
  email: z.string().email('כתובת אימייל לא תקינה'),
  role: z.enum(['admin', 'user', 'viewer']),
  permissions: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastLogin: z.date().optional(),
  status: z.enum(['active', 'inactive', 'suspended']),
  settings: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    notifications: z.boolean(),
    language: z.string(),
    timezone: z.string()
  })
});

export const SystemStatsSchema = z.object({
  cpu: z.object({
    usage: z.number(),
    temperature: z.number(),
    cores: z.number()
  }),
  memory: z.object({
    total: z.number(),
    used: z.number(),
    free: z.number()
  }),
  disk: z.object({
    total: z.number(),
    used: z.number(),
    free: z.number()
  }),
  network: z.object({
    bytesIn: z.number(),
    bytesOut: z.number(),
    connections: z.number()
  }),
  uptime: z.number()
});

export const NotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.enum(['info', 'success', 'warning', 'error']),
  read: z.boolean(),
  timestamp: z.date(),
  userId: z.string().optional(),
  metadata: z.record(z.unknown()).optional()
});

export type User = z.infer<typeof UserSchema>;
export type SystemStats = z.infer<typeof SystemStatsSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type WindowsDisplaySettings = z.infer<typeof WindowsDisplaySettingsSchema>;

export interface AppState {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  notifications: Notification[];
  systemStats: SystemStats | null;
  loading: boolean;
  error: string | null;
  displaySettings: WindowsDisplaySettings;
  fontSize: number;
  reducedMotion: boolean;
  highContrast: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  updateDisplaySettings: () => void;
  setFontSize: (size: number) => void;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

export interface SystemState {
  stats: SystemStats | null;
  alerts: Notification[];
  status: 'idle' | 'monitoring' | 'error';
  error: string | null;
  startMonitoring: () => () => void;
  stopMonitoring: () => void;
  clearAlerts: () => void;
  markAlertAsRead: (alertId: string) => void;
  removeAlert: (alertId: string) => void;
}