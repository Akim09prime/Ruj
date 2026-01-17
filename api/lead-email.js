export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const { name, email, phone, city, message, company, createdAt } = req.body;

  // Honeypot check - return success if bot fills this
  if (company) {
    return res.status(200).json({ ok: true });
  }

  // Basic Validation
  if (!name || !message || (!email && !phone)) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const LEADS_TO_EMAIL = process.env.LEADS_TO_EMAIL;
  const LEADS_FROM_EMAIL = process.env.LEADS_FROM_EMAIL;

  if (!RESEND_API_KEY || !LEADS_TO_EMAIL || !LEADS_FROM_EMAIL) {
    console.error('Missing Resend env vars');
    return res.status(500).json({ ok: false, error: 'Server configuration error' });
  }

  try {
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: LEADS_FROM_EMAIL,
        to: LEADS_TO_EMAIL,
        subject: `Lead nou — RUJ`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="border-bottom: 2px solid #B8923B; padding-bottom: 10px;">Lead Nou</h2>
            <p><strong>Nume:</strong> ${name}</p>
            <p><strong>Telefon:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Oraș:</strong> ${city}</p>
            <p><strong>Dată:</strong> ${createdAt || new Date().toISOString()}</p>
            
            <h3 style="margin-top: 20px;">Mesaj:</h3>
            <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #B8923B;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        `
      })
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      throw new Error(errorData.message || 'Resend API rejected request');
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Email API Error:', error);
    return res.status(500).json({ ok: false, error: 'Failed to send email' });
  }
}