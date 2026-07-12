'use client';

import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

/**
 * AlertBanner — Komponen reusable untuk menampilkan pesan status (error/success/warning/info).
 *
 * Menggantikan pola <div> berulang di seluruh halaman dashboard.
 *
 * Props:
 * @param {'error'|'success'|'warning'|'info'} type - Jenis pesan
 * @param {string}   message   - Teks pesan yang ditampilkan
 * @param {boolean}  [dismissible] - Apakah banner bisa ditutup secara manual
 * @param {Function} [onDismiss]   - Callback saat banner ditutup
 * @param {string}   [className]   - Kelas tambahan (opsional)
 * @param {'xs'|'sm'} [size]       - Ukuran teks. Default 'xs'
 */
export default function AlertBanner({
  type = 'error',
  message,
  dismissible = false,
  onDismiss,
  className = '',
  size = 'xs',
}) {
  if (!message) return null;

  const variants = {
    error: {
      wrapper: 'bg-red-500/10 border-red-500/20 text-red-400',
      icon: <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />,
    },
    success: {
      wrapper: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      icon: <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />,
    },
    warning: {
      wrapper: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      icon: <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />,
    },
    info: {
      wrapper: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      icon: <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />,
    },
  };

  const sizeClass = size === 'sm' ? 'text-sm' : 'text-xs';
  const { wrapper, icon } = variants[type] || variants.error;

  return (
    <div
      className={`border rounded-xl p-3.5 flex gap-2.5 items-start ${wrapper} ${sizeClass} ${className}`}
      role="alert"
    >
      {icon}
      <span className="flex-1 leading-relaxed">{message}</span>
      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Tutup"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
