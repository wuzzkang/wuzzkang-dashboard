'use client';

import { X, Download } from 'lucide-react';

/**
 * QrisZoomModal — Modal fullscreen untuk memperbesar tampilan kode QRIS.
 *
 * Digunakan di halaman topup dan payments/history (sebelumnya duplikat).
 *
 * Props:
 * @param {boolean}  isOpen      - Apakah modal terbuka
 * @param {Function} onClose     - Callback saat modal ditutup
 * @param {object}   transaction - Objek transaksi yang mengandung metadata QRIS
 *                                 (transaction.metadata?.qr_image_url, transaction.order_id, dll)
 */
export default function QrisZoomModal({ isOpen, onClose, transaction }) {
  if (!isOpen || !transaction) return null;

  const qrUrl =
    transaction.metadata?.qr_image_url ||
    transaction.winpay?.qrUrl ||
    '/qris.png';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `QRIS-${transaction.order_id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md transition-all duration-300 cursor-zoom-out animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-5 rounded-3xl w-full max-w-[400px] shadow-2xl relative text-slate-900 flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          title="Tutup"
          aria-label="Tutup modal QRIS"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="text-center mt-2">
          <h3
            className="text-base font-black tracking-tight text-slate-900"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Scan Kode QRIS
          </h3>
          <p className="text-[10px] font-mono text-slate-500 mt-1">
            Order ID: {transaction.order_id}
          </p>
        </div>

        {/* QRIS Large Image */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 flex items-center justify-center shadow-inner">
          <img
            src={qrUrl}
            alt="QRIS Code Large"
            className="w-[300px] h-[300px] object-contain"
          />
        </div>

        {/* Download button */}
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Unduh Gambar QRIS</span>
        </button>

        <div className="w-full">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200/60 cursor-pointer active:scale-[0.98]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
