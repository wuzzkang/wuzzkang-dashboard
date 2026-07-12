'use client';

/**
 * TransactionStatusBadge — Badge warna untuk status transaksi.
 *
 * Menggantikan logika statusColor yang duplikat di topup/page.js dan payments/history/page.js.
 *
 * Props:
 * @param {'PAID'|'SUCCESS'|'PENDING'|'EXPIRED'|'FAILED'} status - Status transaksi
 * @param {string} [className] - Kelas tambahan (opsional)
 */
export default function TransactionStatusBadge({ status, className = '' }) {
  const styleMap = {
    PAID:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    SUCCESS: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    PENDING: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    EXPIRED: 'text-theme-text-muted bg-theme-bg border-theme-border',
    FAILED:  'text-red-400 bg-red-500/10 border-red-500/20',
  };

  const colorClass = styleMap[status] || 'text-theme-text-sec bg-theme-bg border-theme-border';

  return (
    <span
      className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${colorClass} ${className}`}
    >
      {status}
    </span>
  );
}

/**
 * Utility function untuk mendapatkan class string status transaksi.
 * Berguna ketika ingin mengaplikasikan style tanpa render komponen.
 *
 * @param {'PAID'|'SUCCESS'|'PENDING'|'EXPIRED'|'FAILED'} status
 * @returns {string} Tailwind class string
 */
export function getTransactionStatusClass(status) {
  const styleMap = {
    PAID:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    SUCCESS: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    PENDING: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    EXPIRED: 'text-theme-text-muted bg-theme-bg border-theme-border',
    FAILED:  'text-red-400 bg-red-500/10 border-red-500/20',
  };
  return styleMap[status] || 'text-theme-text-sec bg-theme-bg border-theme-border';
}
