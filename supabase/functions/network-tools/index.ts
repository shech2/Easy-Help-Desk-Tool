import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ping } from "npm:ping@0.4.4";
import { lookup } from "npm:dns@0.2.2";
import { promisify } from "npm:util@1.0.0";

const dnsLookup = promisify(lookup);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { host, command = 'ping' } = await req.json();

    if (!host) {
      throw new Error("נדרש להזין כתובת יעד");
    }

    // בדיקת תקינות הכתובת
    const hostRegex = /^[a-zA-Z0-9.-]+$/;
    if (!hostRegex.test(host)) {
      throw new Error("כתובת היעד מכילה תווים לא חוקיים");
    }

    let result;
    switch (command) {
      case 'ping': {
        result = await ping.promise.probe(host, {
          timeout: 10,
          extra: ["-c", "4"],
          numeric: true
        });
        break;
      }
      case 'dns': {
        const dnsResult = await dnsLookup(host);
        result = {
          address: dnsResult.address,
          family: `IPv${dnsResult.family}`
        };
        break;
      }
      case 'traceroute': {
        // Implement traceroute logic here
        result = { message: "Traceroute functionality coming soon" };
        break;
      }
      case 'port-scan': {
        // Implement port scanning logic here
        result = { message: "Port scanning functionality coming soon" };
        break;
      }
      default:
        throw new Error("פקודה לא נתמכת");
    }

    return new Response(
      JSON.stringify(result),
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