'use client';

import Sidebar from '@/components/Sidebar';

/**
 * PageLayout — Wrapper layout responsif untuk semua halaman dashboard.
 *
 * Menerapkan responsivitas penuh:
 * - Mobile: Konten berpusat di max-w-md dengan bottom bar navigation.
 * - Desktop/Laptop: Konten melebar secara fleksibel hingga max-w-6xl/7xl dengan top navigation bar.
 */
export default function PageLayout({ children, mainClassName = '', wrapperClassName = '' }) {
  return (
    <div className={`min-h-screen bg-theme-bg flex flex-col transition-theme ${wrapperClassName}`}>
      <Sidebar />
      <main
        className={`flex-grow p-3 md:p-5 flex flex-col min-h-screen pt-20 pb-28 md:pb-8 mx-auto w-full bg-theme-surface border-x border-theme-border relative transition-theme ${mainClassName ? mainClassName : 'max-w-md md:max-w-6xl lg:max-w-7xl'}`}
      >
        {children}
      </main>
    </div>
  );
}
