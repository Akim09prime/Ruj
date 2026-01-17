export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, phone, city, message, company } = req.body;

  // Honeypot check
  if (company) {
    return res.status(200).json({ message: 'Success' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram credentials missing');
    return res.status(200).json({ message: 'Saved locally' });
  }

  const text = `
🆕 **Lead Nou (Site)**
👤 **Nume:** ${name}
📧 **Email:** ${email}
📞 **Tel:** ${phone}
📍 **Oraș:** ${city}

💬 **Mesaj:**
${message}
  `;

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });

    if (!telegramRes.ok) {
      throw new Error('Telegram API Error');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Telegram Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}