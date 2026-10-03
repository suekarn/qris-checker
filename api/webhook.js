export default async function handler(req, res) {
  const SECRET_TOKEN = process.env.WEBHOOK_SECRET || "MY_SECRET_KEY_123";
  const authHeader = req.headers["x-api-key"];

  if (authHeader !== SECRET_TOKEN) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { notification_text, notification_title, app_name } = req.body;

    const regex = /Rp\s?([\d.]+)/i;
    const match = notification_text ? notification_text.match(regex) : null;

    if (match && match[1]) {
      const amount = parseInt(match[1].replace(/\./g, ""), 10);

      console.log(`[SUCCESS] Pembayaran Diterima untuk Nominal: Rp ${amount}`);

      return res.status(200).json({
        success: true,
        amount: amount,
        status: "MATCHED"
      });
    }

    return res.status(400).json({ success: false, message: "Nominal tidak ditemukan di teks" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
