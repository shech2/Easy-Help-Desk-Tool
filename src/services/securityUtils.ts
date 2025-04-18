import { z } from 'zod';
import { jwtDecode } from 'jwt-decode';

// סכמת ולידציה לטוקן
const TokenPayloadSchema = z.object({
  sub: z.string(),
  exp: z.number(),
  iat: z.number(),
  role: z.string(),
  permissions: z.array(z.string())
});

export const validateToken = (token: string): boolean => {
  try {
    const decoded = jwtDecode(token);
    TokenPayloadSchema.parse(decoded);
    
    const currentTime = Math.floor(Date.now() / 1000);
    return (decoded.exp as number) > currentTime;
  } catch {
    return false;
  }
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const validatePassword = (password: string): { 
  isValid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('הסיסמה חייבת להכיל לפחות 8 תווים');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('הסיסמה חייבת להכיל לפחות אות גדולה אחת');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('הסיסמה חייבת להכיל לפחות אות קטנה אחת');
  }
  
  if (!/\d/.test(password)) {
    errors.push('הסיסמה חייבת להכיל לפחות ספרה אחת');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('הסיסמה חייבת להכיל לפחות תו מיוחד אחד');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const hashData = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
};

export const rateLimit = (() => {
  const requests = new Map<string, number[]>();
  const WINDOW_MS = 60000; // חלון זמן של דקה
  const MAX_REQUESTS = 100; // מקסימום בקשות בחלון זמן

  return (key: string): boolean => {
    const now = Date.now();
    const timestamps = requests.get(key) || [];
    
    // ניקוי בקשות ישנות
    const recentTimestamps = timestamps.filter(time => now - time < WINDOW_MS);
    
    if (recentTimestamps.length >= MAX_REQUESTS) {
      return false;
    }
    
    recentTimestamps.push(now);
    requests.set(key, recentTimestamps);
    return true;
  };
})();