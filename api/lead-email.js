export default async function handler(req, res) {
  // 1. CONSTANTS & CONFIG
  const TIMEOUT_MS = 5000; // 5 seconds internal timeout for Resend
  const startTime = Date.now();

  // 2. CORS & HEADERS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // 3. HANDLE PREFLIGHT
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // 4. HANDLE METHOD
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      ok: false, 
      code: 'METHOD_NOT_ALLOWED', 
      error: 'Only POST requests are accepted.' 
    });
  }

  try {
    // 5. BODY PARSING & VALIDATION
    let body = req.body;
    
    // Handle Vercel sometimes passing body as string
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error("JSON Parse Error:", e.message);
        return res.status(400).json({ 
          ok: false, 
          code: 'INVALID_JSON', 
          error: 'Request body must be valid JSON.' 
        });
      }
    }

    const { name, email, phone, city, message, company, createdAt } = body || {};

    // HONEYPOT CHECK
    if (company) {
      console.log("Honeypot triggered");
      return res.status(200).json({ ok: true, id: 'honeypot_success' });
    }

    // REQUIRED FIELDS
    if (!name || !message || (!email && !phone)) {
      return res.status(400).json({ 
        ok: false, 
        code: 'VALIDATION_ERROR', 
        error: 'Missing required fields (name, message, or contact info).' 
      });
    }

    // 6. ENV VARS
    const apiKey = process.env.RESEND_API_KEY;
    const emailTo = process.env.EMAIL_TO;
    const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";

    // Debug Logs (Server Side)
    console.log(`[LeadAPI] Init: From=${emailFrom} | To=${emailTo} | HasKey=${!!apiKey}`);

    if (!apiKey || !emailTo) {
      console.error("[LeadAPI] Error: Missing Environment Variables");
      return res.status(500).json({ 
        ok: false, 
        code: 'MISSING_ENV', 
        error: 'Server configuration error: Missing API Key or Recipient.' 
      });
    }

    // 7. PREPARE EMAIL
    const emailPayload = {
      from: emailFrom, // Must be verified domain or onboarding@resend.dev
      to: [emailTo],
      reply_to: email || undefined,
      subject: "Lead nou — RUJ",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e0e0e0;">
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
            <h2 style="color: #B8923B; margin: 0;">Lead Nou — Website</h2>
          </div>
          <div style="padding: 20px;">
            <p><strong>Nume:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email || '-'}</p>
            <p><strong>Telefon:</strong> ${phone || '-'}</p>
            <p><strong>Oraș:</strong> ${city || '-'}</p>
            <p><strong>Data:</strong> ${createdAt || new Date().toISOString()}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <h3 style="margin-top: 0;">Mesaj:</h3>
            <p style="white-space: pre-wrap; background-color: #fafafa; padding: 15px; border-left: 3px solid #B8923B;">${message}</p>
          </div>
          <div style="background-color: #333; color: #fff; padding: 10px; text-align: center; font-size: 12px;">
            Sistem Generat Automat - Carvello CMS
          </div>
        </div>
      `,
      text: `Nume: ${name}\nEmail: ${email}\nTel: ${phone}\nMesaj: ${message}`
    };

    // 8. SEND WITH TIMEOUT (Native Fetch)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      console.log("[LeadAPI] Sending to Resend...");
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const responseText = await resendRes.text();
      let responseJson = null;
      try { responseJson = JSON.parse(responseText); } catch {}

      console.log(`[LeadAPI] Resend Status: ${resendRes.status}`);
      
      if (!resendRes.ok) {
        console.error(`[LeadAPI] Resend Error Body:`, responseText);
        // Return 502 Bad Gateway for upstream errors, with specific details
        return res.status(502).json({
          ok: false,
          code: 'RESEND_ERROR',
          error: responseJson?.message || responseJson?.name || 'Unknown Resend Error',
          details: responseText
        });
      }

      console.log(`[LeadAPI] Success. ID: ${responseJson?.id}`);
      return res.status(200).json({ ok: true, id: responseJson?.id });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("[LeadAPI] Fetch Error:", fetchError);

      if (fetchError.name === 'AbortError') {
        return res.status(504).json({ 
          ok: false, 
          code: 'GATEWAY_TIMEOUT', 
          error: `Resend API timed out after ${TIMEOUT_MS}ms` 
        });
      }

      return res.status(500).json({ 
        ok: false, 
        code: 'FETCH_ERROR', 
        error: fetchError.message 
      });
    }

  } catch (criticalError) {
    console.error("[LeadAPI] Critical Handler Error:", criticalError);
    return res.status(500).json({ 
      ok: false, 
      code: 'INTERNAL_SERVER_ERROR', 
      error: criticalError.message 
    });
  }
}