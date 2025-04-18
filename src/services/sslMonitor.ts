import { z } from 'zod';

const SSLCertificateSchema = z.object({
  domain: z.string(),
  validFrom: z.date(),
  validTo: z.date(),
  issuer: z.string(),
  subject: z.string(),
  serialNumber: z.string(),
  version: z.number(),
  signatureAlgorithm: z.string(),
  grade: z.enum(['A+', 'A', 'B', 'C', 'D', 'F']),
  protocols: z.array(z.string()),
  ciphers: z.array(z.string())
});

type SSLCertificate = z.infer<typeof SSLCertificateSchema>;

const checkRateLimit = async (domain: string) => {
  const now = Date.now();
  const key = `ssl-check:${domain}`;
  const lastCheck = localStorage.getItem(key);
  
  if (lastCheck && now - parseInt(lastCheck) < 3600000) {
    throw new Error('נא להמתין שעה בין בדיקות לאותו דומיין');
  }
  
  localStorage.setItem(key, now.toString());
};

export const checkSSLCertificate = async (domain: string): Promise<SSLCertificate> => {
  try {
    await checkRateLimit(domain);

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ssl-check`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domain }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'שגיאה בבדיקת תעודת SSL');
    }

    const data = await response.json();
    return SSLCertificateSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('תגובה לא תקינה מהשרת');
    }
    throw error;
  }
};

export const getExpiryStatus = (validTo: Date) => {
  const now = new Date();
  const daysUntilExpiry = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) return { status: 'expired', message: 'פג תוקף' };
  if (daysUntilExpiry < 7) return { status: 'critical', message: 'פחות משבוע' };
  if (daysUntilExpiry < 30) return { status: 'warning', message: 'פחות מחודש' };
  return { status: 'valid', message: `${daysUntilExpiry} ימים` };
};