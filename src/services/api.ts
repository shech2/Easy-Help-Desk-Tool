import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import { z } from 'zod';
import { handleError } from './errorHandler';
import { sanitizeInput } from './securityUtils';

// סכמת ולידציה לבקשות
const RequestSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  url: z.string().url(),
  data: z.any().optional(),
  headers: z.record(z.string()).optional()
});

// רשימת נתיבים שלא דורשים אימות
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];

// מעקב אחר בקשות
const requestLog: { timestamp: number; url: string }[] = [];
const RATE_LIMIT_WINDOW = 60 * 1000; // חלון זמן של דקה
const MAX_REQUESTS = 100; // מקסימום בקשות בחלון זמן

// הגדרות בסיסיות
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      // ולידציה של הבקשה
      const validatedRequest = RequestSchema.parse({
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        headers: config.headers
      });

      // בדיקת הגבלת קצב
      const now = Date.now();
      requestLog.push({ timestamp: now, url: config.url || '' });
      
      // ניקוי בקשות ישנות
      while (requestLog.length > 0 && now - requestLog[0].timestamp > RATE_LIMIT_WINDOW) {
        requestLog.shift();
      }

      if (requestLog.length > MAX_REQUESTS) {
        throw new Error('בוצעו יותר מדי בקשות. נא להמתין מעט');
      }

      // בדיקה האם הנתיב דורש אימות
      const isPublicRoute = PUBLIC_ROUTES.some(route => 
        config.url?.includes(route)
      );

      if (!isPublicRoute) {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('נדרשת התחברות');
        }
        config.headers.Authorization = `Bearer ${token}`;
      }

      // הוספת CSRF token
      const csrfToken = document.querySelector('meta[name="csrf-token"]');
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken.getAttribute('content');
      }

      // סניטציה של נתונים
      if (config.data) {
        config.data = sanitizeInput(config.data);
      }

      return config;
    } catch (error) {
      handleError(error, { context: 'request interceptor' });
      return Promise.reject(error);
    }
  },
  (error) => {
    handleError(error, { context: 'request error' });
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    try {
      // בדיקת תקינות התגובה
      if (!response.data) {
        throw new Error('התקבלה תשובה לא תקינה מהשרת');
      }

      // סניטציה של נתונים מהשרת
      response.data = sanitizeInput(response.data);

      return response;
    } catch (error) {
      handleError(error, { context: 'response interceptor' });
      return Promise.reject(error);
    }
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          toast.error('בקשה לא תקינה');
          break;
        case 401:
          useAuthStore.getState().logout();
          toast.error('פג תוקף החיבור, נא להתחבר מחדש');
          break;
        case 403:
          toast.error('אין לך הרשאה לבצע פעולה זו');
          break;
        case 404:
          toast.error('המשאב המבוקש לא נמצא');
          break;
        case 422:
          toast.error('הנתונים שהוזנו אינם תקינים');
          break;
        case 429:
          toast.error('בוצעו יותר מדי בקשות, נא לנסות שוב מאוחר יותר');
          break;
        case 500:
          toast.error('אירעה שגיאה בשרת');
          break;
        default:
          toast.error('אירעה שגיאה לא צפויה');
      }
    } else if (error.request) {
      toast.error('לא ניתן להתחבר לשרת');
    } else {
      toast.error('אירעה שגיאה בעיבוד הבקשה');
    }

    handleError(error, { context: 'response error' });
    return Promise.reject(error);
  }
);

export default api;