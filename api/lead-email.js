export default async function handler(req, res) {
  // 1. CORS & Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // 2. Preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // 3. Method Check
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, code: 'METHOD_NOT_ALLOWED', error: 'Only POST allowed' });
  }

  try {
    // 4. Body Parsing
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ ok: false, code: 'INVALID_JSON', error: 'Body is not valid JSON' });
      }
    }

    const { name, email, phone, city, message, company, createdAt } = body || {};

    // 5. Honeypot
    if (company) {
      return res.status(200).json({ ok: true, id: 'honeypot_success' });
    }

    // 6. Env Validation
    const apiKey = process.env.RESEND_API_KEY;
    const emailTo = process.env.EMAIL_TO;
    const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";

    const missingEnvs = [];
    if (!apiKey) missingEnvs.push('RESEND_API_KEY');
    if (!emailTo) missingEnvs.push('EMAIL_TO');

    if (missingEnvs.length > 0) {
      console.error('Missing Env Vars:', missingEnvs);
      return res.status(500).json({ 
        ok: false, 
        code: 'MISSING_ENV', 
        missing: missingEnvs,
        error: 'Server configuration incomplete' 
      });
    }

    // 7. Input Validation
    if (!name || !message || (!email && !phone)) {
      return res.status(400).json({ 
        ok: false, 
        code: 'VALIDATION_ERROR', 
        error: 'Missing required fields: name, message, or contact info' 
      });
    }

    // 8. Construct Email
    const emailData = {
      from: `RUJ <${emailFrom}>`,
      to: [emailTo],
      reply_to: email || undefined,
      subject: "Lead nou — RUJ",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #B8923B;">Lead Nou — Website</h2>
          <p><strong>Nume:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email || 'N/A'}</p>
          <p><strong>Telefon:</strong> ${phone || 'N/A'}</p>
          <p><strong>Oraș:</strong> ${city || 'N/A'}</p>
          <p><strong>Data:</strong> ${createdAt || new Date().toISOString()}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <h3 style="color: #333;">Mesaj:</h3>
          <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px;">${message}</p>
        </div>
      `,
      text: `Lead Nou:\nNume: ${name}\nEmail: ${email}\nTel: ${phone}\nMesaj: ${message}`
    };

    // 9. Send via Resend (using fetch to avoid dependencies)
    console.log(`Attempting send to ${emailTo} from ${emailFrom}`);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    const responseText = await response.text();
    let responseJson = {};
    try { responseJson = JSON.parse(responseText); } catch {}

    if (!response.ok) {
      console.error('Resend API Error:', responseText);
      return res.status(500).json({ 
        ok: false, 
        code: 'RESEND_ERROR', 
        error: responseJson.message || responseJson.name || responseText 
      });
    }

    return res.status(200).json({ ok: true, id: responseJson.id });

  } catch (err) {
    console.error('Handler Critical Error:', err);
    return res.status(500).json({ 
      ok: false, 
      code: 'INTERNAL_SERVER_ERROR', 
      error: err.message 
    });
  }
}