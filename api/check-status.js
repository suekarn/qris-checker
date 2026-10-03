global.payments = global.payments || {};

export default async function handler(req, res) {
  // Izinkan akses dari hotspot
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { amount } = req.query;

  if (!amount) {
    return res.status(400).json({ paid: false, message: 'Parameter amount diperlukan' });
  }

  const numericAmount = parseInt(amount, 10);
  const payment = global.payments[numericAmount];

  if (payment && payment.paid) {
    // Hapus data setelah diambil agar tidak terpakai ulang
    delete global.payments[numericAmount];

    return res.status(200).json({
      paid: true,
      voucher_code: payment.voucher_code
    });
  }

  return res.status(200).json({ paid: false });
}
