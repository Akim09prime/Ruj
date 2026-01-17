export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const { name, phone, email, city, message, company } = req.body || {};

    // Honeypot anti-spam
    if (company && String(company).trim() !== "") {
      return res.status(200).json({ ok: true });
    }

    if (!name || !message || (!phone && !email)) {
      return res.status(400).json({
        ok: false,
        error: "Missing required fields: name, message, and phone OR email",
      });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return res.status(500).json({
        ok: false,
        error: "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID on server",
      });
    }

    const text =
      `🧾 CERERE OFERTĂ / LEAD NOU\n\n` +
      `👤 Nume: ${name}\n` +
      `📞 Telefon: ${phone || "-"}\n` +
      `📧 Email: ${email || "-"}\n` +
      `📍 Oraș: ${city || "-"}\n\n` +
      `💬 Mesaj:\n${message}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!tgRes.ok) {
      const errText = await tgRes.text();
      return res.status(500).json({ ok: false, error: errText });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err?.message || "Unknown server error",
    });
  }
}
