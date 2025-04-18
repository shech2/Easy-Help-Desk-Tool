import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { connect } from "npm:tls@4.0.1";

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
    const { domain } = await req.json();

    if (!domain) {
      throw new Error("נדרש להזין דומיין");
    }

    // בדיקת תקינות הדומיין
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      throw new Error("דומיין לא תקין");
    }

    const socket = await connect({
      host: domain,
      port: 443,
      timeout: 10000,
      rejectUnauthorized: false
    });

    const cert = socket.getPeerCertificate(true);
    socket.end();

    // בדיקת תצורת SSL
    const protocols = socket.getProtocol().split(',');
    const ciphers = socket.getCipher().name.split('-');
    
    let grade = 'A';
    if (protocols.includes('TLSv1.3')) {
      grade = 'A+';
    } else if (protocols.includes('TLSv1.2')) {
      grade = 'A';
    } else if (protocols.includes('TLSv1.1')) {
      grade = 'B';
    } else if (protocols.includes('TLSv1')) {
      grade = 'C';
    } else {
      grade = 'F';
    }

    const result = {
      domain,
      validFrom: new Date(cert.valid_from),
      validTo: new Date(cert.valid_to),
      issuer: cert.issuer.CN,
      subject: cert.subject.CN,
      serialNumber: cert.serialNumber,
      version: cert.version,
      signatureAlgorithm: cert.signatureAlgorithm,
      grade,
      protocols,
      ciphers
    };

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