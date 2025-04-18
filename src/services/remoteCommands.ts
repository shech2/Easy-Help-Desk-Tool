import { z } from 'zod';

// סכמת ולידציה לתוצאות פקודה
const CommandResultSchema = z.object({
  output: z.string(),
  error: z.boolean()
});

// רשימת פקודות זמינות
export const AVAILABLE_COMMANDS = {
  'gpupdate': 'עדכון מדיניות קבוצתית',
  'ipconfig': 'הצגת הגדרות רשת',
  'netstat': 'הצגת חיבורי רשת פעילים',
  'systeminfo': 'מידע על המערכת',
  'tasklist': 'רשימת תהליכים',
  'whoami': 'זהות המשתמש הנוכחי',
  'hostname': 'שם המחשב',
  'route': 'טבלת ניתוב',
  'arp': 'טבלת ARP',
  'nslookup': 'בדיקת DNS',
  'tracert': 'מעקב נתיב',
  'netsh': 'הגדרות רשת אלחוטית'
};

export const executeCommand = async (command: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/remote-commands`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'שגיאה בביצוע הפקודה');
    }

    const data = await response.json();
    return CommandResultSchema.parse(data);

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('תגובה לא תקינה מהשרת');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('שגיאה לא צפויה בביצוע הפקודה');
  }
};