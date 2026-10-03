import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Lokasi file vouchers.json di root direktori
  const filePath = path.join(process.cwd(), 'vouchers.json');

  try {
    // 1. Baca data stok voucher
    const fileData = fs.readFileSync(filePath, 'utf8');
    const vouchers = JSON.parse(fileData);

    // 2. Tentukan nominal yang dicari (default nominal "1000")
    const nominal = req.query.amount || req.body?.amount || "1000";

    // 3. Cek ketersediaan stok
    if (vouchers[nominal] && vouchers[nominal].length > 0) {
      // Ambil kode voucher pertama tanpa menghapus file (atau sesuaikan sesuai kebutuhan)
      const kodeVoucher = vouchers[nominal][0];

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
      message: 'Gagal membaca data voucher',
      error: error.message
    });
  }
}
