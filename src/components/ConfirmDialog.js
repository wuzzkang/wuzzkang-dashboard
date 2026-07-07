'use client';

import { useEffect, useRef } from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  onConfirm,
  onCancel,
  variant = 'info', // 'danger' | 'warning' | 'info'
}) {
  const prevIsOpenRef = useRef(false);

  // Sync with browser back button (popstate)
  useEffect(() => {
    const handlePopState = (event) => {
      if (isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      window.addEventListener('popstate', handlePopState);
    }
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onCancel]);

  useEffect(() => {
    if (isOpen) {
      if (!window.history.state || window.history.state.modalId !== 'confirm-dialog') {
        window.history.pushState({ modalId: 'confirm-dialog' }, '');
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && prevIsOpenRef.current) {
      if (typeof window !== 'undefined' && window.history.state?.modalId === 'confirm-dialog') {
        window.history.back();
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      bgIcon: 'bg-red-500/10',
      confirmBtn: 'bg-red-600 hover:bg-red-700 text-white shadow-sm active:scale-[0.98]',
    },
    warning: {
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      bgIcon: 'bg-amber-500/10',
      confirmBtn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm active:scale-[0.98]',
    },
    info: {
      icon: <Info className="h-5 w-5 text-theme-accent" />,
      bgIcon: 'bg-theme-accent/10',
      confirmBtn: 'bg-theme-accent hover:bg-theme-accent-hover text-white shadow-sm active:scale-[0.98]',
    },
  };

  const style = variantStyles[variant] || variantStyles.info;

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-theme-surface border border-theme-border rounded-3xl w-full max-w-[340px] shadow-2xl relative text-theme-text p-5 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Icon + Title */}
        <div className="flex items-start gap-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${style.bgIcon}`}>
            {style.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold tracking-tight text-theme-text" style={{ fontFamily: "'Sora', sans-serif" }}>
              {title}
            </h3>
            <p className="text-[11px] text-theme-text-sec mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 px-3 bg-theme-bg border border-theme-border hover:bg-theme-card/30 text-theme-text rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-[0.98]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${style.confirmBtn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
