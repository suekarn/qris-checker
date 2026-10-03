// Storage variabel global
global.payments = global.payments || {};

export default async function handler(req, res) {
  // Izinkan akses dari domain hotspot
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { notification_text } = req.body || {};

    if (!notification_text) {
      return res.status(400).json({ success: false, message: 'Teks notifikasi kosong' });
    }

    // Tangkap angka nominal dari notifikasi DANA/SeaBank/e-wallet
    // Contoh teks: "Kamu menerima Rp 1.000 dari..."
    const match = notification_text.match(/Rp\s*([\d.]+)/i);
    
    if (match) {
      const amount = parseInt(match[1].replace(/\./g, ''), 10);
      
      // Generate Kode Voucher acak
      const randomVoucher = 'V' + Math.floor(100000 + Math.random() * 900000);

      // Simpan status pembayaran
      global.payments[amount] = {
        paid: true,
        voucher_code: randomVoucher,
        timestamp: Date.now()
      };

      return res.status(200).json({
        success: true,
        message: 'Pembayaran berhasil dicatat',
        amount: amount,
        voucher_code: randomVoucher
      });
    }

    return res.status(200).json({ success: true, message: 'Notifikasi dibaca, tidak ada nominal yang cocok' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
