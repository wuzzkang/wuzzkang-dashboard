'use client';

import Sidebar from '@/components/Sidebar';

/**
 * PageLayout — Wrapper layout standar untuk semua halaman dashboard utama.
 *
 * Menggantikan struktur layout yang berulang:
 * <div className="min-h-screen bg-theme-bg flex flex-col transition-theme">
 *   <Sidebar />
 *   <main className="...pt-20 pb-28 max-w-md...">
 *     {children}
 *   </main>
 * </div>
 *
 * Props:
 * @param {React.ReactNode} children   - Konten halaman
 * @param {string} [mainClassName]     - Kelas tambahan untuk elemen <main>
 * @param {string} [wrapperClassName]  - Kelas tambahan untuk wrapper <div>
 */
export default function PageLayout({ children, mainClassName = '', wrapperClassName = '' }) {
  return (
    <div className={`min-h-screen bg-theme-bg flex flex-col transition-theme ${wrapperClassName}`}>
      <Sidebar />
      <main
        className={`flex-grow p-4 flex flex-col min-h-screen pt-20 pb-28 max-w-md mx-auto w-full bg-theme-surface border-x border-theme-border relative transition-theme ${mainClassName}`}
      >
        {children}
      </main>
    </div>
  );
}
