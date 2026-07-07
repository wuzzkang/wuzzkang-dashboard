'use client';

import { Loader2 } from 'lucide-react';

export default function Loading({ fullScreen = false, text = '', size = 'md' }) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const containerClasses = fullScreen
    ? 'min-h-screen w-full flex flex-col items-center justify-center bg-slate-950/95 fixed inset-0 z-50'
    : 'w-full flex flex-col items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin`} style={{ color: 'var(--theme-accent)' }} />
        {text && (
          <p className="text-[10px] font-bold text-theme-text-muted uppercase tracking-wider animate-pulse" style={{ fontFamily: "'Sora', sans-serif" }}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
