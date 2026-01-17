// Simple in-memory store for rate limiting (reset on cold start is acceptable for serverless)
const rateLimit = new Map();

export default async function handler(req, res) {
  const TIMEOUT_MS = 8000; // 8 seconds internal timeout
  const MAX_REQUESTS = 3;
  const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

  // 1. CORS & HEADERS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, code: 'METHOD_NOT_ALLOWED' });
  }

  // 2. RATE LIMITING (Simple IP check)
  const ip = req.headers['x-forwarded-for'] || 'unknown-ip';
  const now = Date.now();
  const clientRecord = rateLimit.get(ip) || { count: 0, firstRequest: now };

  if (now - clientRecord.firstRequest > WINDOW_MS) {
    // Reset window
    clientRecord.count = 1;
    clientRecord.firstRequest = now;
  } else {
    clientRecord.count++;
  }
  
  rateLimit.set(ip, clientRecord);

  if (clientRecord.count > MAX_REQUESTS) {
    console.warn(`[LeadAPI] Rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({ ok: false, code: 'RATE_LIMIT', error: 'Too many requests. Please try again later.' });
  }

  try {
    // 3. PARSE & VALIDATE
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return res.status(400).json({ ok: false, code: 'INVALID_JSON' }); }
    }

    const { name, email, phone, city, message, company, createdAt, userAgent, currentUrl } = body || {};

    // Honeypot Check
    if (company) {
      console.log("[LeadAPI] Honeypot triggered");
      return res.status(200).json({ ok: true, id: 'honeypot' });
    }

    if (!name || !message || (!email && !phone)) {
      return res.status(400).json({ ok: false, code: 'VALIDATION_ERROR', error: 'Missing fields' });
    }

    // 4. ENV CONFIG
    const apiKey = process.env.RESEND_API_KEY;
    const emailTo = process.env.EMAIL_TO; // Your Gmail
    const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";

    if (!apiKey || !emailTo) {
      console.error("[LeadAPI] Missing Config");
      return res.status(500).json({ ok: false, code: 'MISSING_ENV' });
    }

    // 5. PREPARE EMAILS
    
    // Email A: Notification to Admin
    const adminEmailPayload = {
      from: `RUJ Lead System <${emailFrom}>`,
      to: [emailTo],
      reply_to: email || undefined,
      subject: "Lead nou — RUJ",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 4px; overflow: hidden;">
            <div style="background-color: #1a1a1a; padding: 15px 20px;">
              <h2 style="color: #B8923B; margin: 0; font-size: 18px; letter-spacing: 1px;">LEAD NOU — WEBSITE</h2>
            </div>
            <div style="padding: 30px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #666; width: 100px;">Nume:</td><td style="padding: 8px 0; font-weight: bold;">${name}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Email:</td><td style="padding: 8px 0; font-weight: bold;">${email || '-'}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Telefon:</td><td style="padding: 8px 0; font-weight: bold;">${phone || '-'}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Oraș:</td><td style="padding: 8px 0; font-weight: bold;">${city || '-'}</td></tr>
              </table>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="color: #666; margin-bottom: 10px;">Mesaj:</p>
              <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #B8923B; white-space: pre-wrap;">${message}</div>
              
              <div style="margin-top: 30px; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 10px;">
                <p>📍 Page: ${currentUrl || 'Unknown'}</p>
                <p>💻 Device: ${userAgent || 'Unknown'}</p>
                <p>🕒 Time: ${createdAt || new Date().toISOString()}</p>
              </div>
            </div>
          </div>
        </div>
      `,
      text: `Lead Nou:\nNume: ${name}\nEmail: ${email}\nTel: ${phone}\nMesaj: ${message}`
    };

    // Email B: Confirmation to Client (Only if email provided)
    let clientEmailPayload = null;
    if (email) {
      clientEmailPayload = {
        from: `RUJ / CARVELLO <${emailFrom}>`,
        to: [email],
        reply_to: emailTo, // Client replies to Admin
        subject: "Am primit cererea ta — RUJ",
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Salut ${name},</h2>
              <p style="color: #555; line-height: 1.6;">
                Am primit solicitarea ta de ofertă. Îți mulțumim pentru interesul acordat serviciilor RUJ / CARVELLO.
              </p>
              <p style="color: #555; line-height: 1.6;">
                Echipa noastră tehnică analizează detaliile trimise. Te vom contacta în curând pentru a discuta următorii pași.
              </p>
              <br>
              <p style="color: #888; font-size: 14px;">Cu respect,<br>Echipa RUJ</p>
            </div>
          </div>
        `,
        text: `Salut ${name},\n\nAm primit solicitarea ta. Te vom contacta în curând.\n\nCu respect,\nEchipa RUJ`
      };
    }

    // 6. SENDING LOGIC (Native Fetch)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      // Send Admin Email (Critical)
      const adminRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminEmailPayload),
        signal: controller.signal
      });

      if (!adminRes.ok) {
        const errText = await adminRes.text();
        console.error(`[LeadAPI] Admin Email Failed: ${adminRes.status} ${errText}`);
        clearTimeout(timeout);
        return res.status(502).json({ ok: false, code: 'RESEND_ERROR_ADMIN', error: 'Failed to notify admin.' });
      }

      // Send Client Email (Non-critical / Best Effort)
      if (clientEmailPayload) {
        // We don't await the result strictly, or we catch errors so the user still gets a success message
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(clientEmailPayload),
          signal: controller.signal
        }).then(r => {
            if (!r.ok) console.warn(`[LeadAPI] Client Email Failed (likely domain not verified in test mode): ${r.status}`);
        }).catch(e => console.warn(`[LeadAPI] Client Email Network Error`));
      }

      clearTimeout(timeout);
      return res.status(200).json({ ok: true });

    } catch (fetchErr) {
      clearTimeout(timeout);
      if (fetchErr.name === 'AbortError') {
        return res.status(504).json({ ok: false, code: 'TIMEOUT' });
      }
      return res.status(500).json({ ok: false, code: 'FETCH_ERROR', error: fetchErr.message });
    }

  } catch (err) {
    console.error("[LeadAPI] Critical:", err);
    return res.status(500).json({ ok: false, code: 'INTERNAL_ERROR' });
  }
}