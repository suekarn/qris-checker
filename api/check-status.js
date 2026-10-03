export default async function handler(req, res) {
  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;

  if (!KV_URL || !KV_TOKEN) {
    return res.status(500).json({ status: 'ERROR', message: 'Environment variables Upstash belum terkonfigurasi' });
  }

  const nominal = req.query.amount || req.body?.amount || "1000";
  const key = `vouchers:${nominal}`;

  try {
    // Ambil sekaligus hapus 1 voucher terdepan dari Redis (perintah LPOP)
    const response = await fetch(`${KV_URL}/lpop/${key}`, {
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
      },
    });

    const data = await response.json();
    const kodeVoucher = data.result;

    if (kodeVoucher) {
      return res.status(200).json({
        status: 'PAID',
        amount: nominal,
        voucher: kodeVoucher
      });
    } else {
      return res.status(200).json({
        status: 'PAID',
        amount: nominal,
        voucher: 'Stok voucher habis'
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'ERROR',
      message: 'Gagal mengambil voucher dari database',
      error: error.message
    });
  }
}
