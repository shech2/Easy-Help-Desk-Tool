import { z } from 'zod';

// סכמות ולידציה
const PingResultSchema = z.object({
  alive: z.boolean(),
  time: z.union([z.number(), z.string()]),
  ttl: z.number().nullable(),
  output: z.string().optional()
});

const DnsResultSchema = z.object({
  address: z.string(),
  family: z.string()
});

const TracerouteResultSchema = z.object({
  hops: z.array(z.object({
    hop: z.number(),
    host: z.string(),
    time: z.number()
  }))
});

const PortScanResultSchema = z.object({
  openPorts: z.array(z.number()),
  closedPorts: z.array(z.number())
});

// מעקב אחר בקשות
const requestLog: { timestamp: number; host: string; command: string }[] = [];
const RATE_LIMIT_WINDOW = 60 * 1000; // חלון זמן של דקה
const MAX_REQUESTS = 30; // מקסימום בקשות בחלון זמן

const checkRateLimit = (host: string, command: string) => {
  const now = Date.now();
  
  // ניקוי בקשות ישנות
  while (requestLog.length > 0 && now - requestLog[0].timestamp > RATE_LIMIT_WINDOW) {
    requestLog.shift();
  }

  // בדיקת הגבלת קצב כללית
  if (requestLog.length >= MAX_REQUESTS) {
    throw new Error('בוצעו יותר מדי בקשות. נא להמתין מעט');
  }

  // בדיקת הגבלת קצב לכתובת ספציפית
  const hostRequests = requestLog.filter(r => r.host === host).length;
  if (hostRequests >= 5) {
    throw new Error('בוצעו יותר מדי בקשות לכתובת זו. נא להמתין מעט');
  }

  // הוספת הבקשה ליומן
  requestLog.push({ timestamp: now, host, command });
};

export const pingHost = async (host: string) => {
  try {
    checkRateLimit(host, 'ping');
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/network-tools`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ host, command: 'ping' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'שגיאה בביצוע הפינג');
    }

    const data = await response.json();
    return PingResultSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('תגובה לא תקינה מהשרת');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('שגיאה לא צפויה בביצוע הפינג');
  }
};

export const dnsLookup = async (host: string) => {
  try {
    checkRateLimit(host, 'dns');
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/network-tools`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ host, command: 'dns' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'שגיאה בבדיקת DNS');
    }

    const data = await response.json();
    return DnsResultSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('תגובה לא תקינה מהשרת');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('שגיאה לא צפויה בבדיקת DNS');
  }
};

export const traceroute = async (host: string) => {
  try {
    checkRateLimit(host, 'traceroute');
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/network-tools`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ host, command: 'traceroute' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'שגיאה בביצוע Traceroute');
    }

    const data = await response.json();
    return TracerouteResultSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('תגובה לא תקינה מהשרת');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('שגיאה לא צפויה בביצוע Traceroute');
  }
};

export const scanPorts = async (host: string, ports: number[]) => {
  try {
    checkRateLimit(host, 'port-scan');
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/network-tools`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ host, command: 'port-scan', ports }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'שגיאה בסריקת פורטים');
    }

    const data = await response.json();
    return PortScanResultSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('תגובה לא תקינה מהשרת');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('שגיאה לא צפויה בסריקת פורטים');
  }
};