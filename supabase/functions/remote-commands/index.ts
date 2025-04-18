import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { exec } from "npm:child_process@1.0.2";
import { promisify } from "npm:util@1.0.0";

const execAsync = promisify(exec);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// רשימת פקודות מותרות
const ALLOWED_COMMANDS = {
  'gpupdate': 'gpupdate /force',
  'ipconfig': 'ipconfig /all',
  'netstat': 'netstat -an',
  'systeminfo': 'systeminfo',
  'tasklist': 'tasklist',
  'whoami': 'whoami',
  'hostname': 'hostname',
  'route': 'route print',
  'arp': 'arp -a',
  'nslookup': 'nslookup',
  'tracert': 'tracert',
  'netsh': 'netsh wlan show all'
};

// מעקב אחר בקשות
const requestLog: { timestamp: number; command: string }[] = [];
const RATE_LIMIT_WINDOW = 60 * 1000; // חלון זמן של דקה
const MAX_REQUESTS = 20; // מקסימום בקשות בחלון זמן

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { command } = await req.json();

    if (!command || !ALLOWED_COMMANDS[command]) {
      throw new Error("פקודה לא חוקית או לא נתמכת");
    }

    // ניקוי בקשות ישנות
    const now = Date.now();
    while (requestLog.length > 0 && now - requestLog[0].timestamp > RATE_LIMIT_WINDOW) {
      requestLog.shift();
    }

    // בדיקת הגבלת קצב
    if (requestLog.length >= MAX_REQUESTS) {
      throw new Error("בוצעו יותר מדי בקשות. נא להמתין מעט");
    }

    // הוספת הבקשה ליומן
    requestLog.push({ timestamp: now, command });

    const { stdout, stderr } = await execAsync(ALLOWED_COMMANDS[command]);

    return new Response(
      JSON.stringify({
        output: stdout || stderr,
        error: stderr ? true : false
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "שגיאה לא צפויה"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});