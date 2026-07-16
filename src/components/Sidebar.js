'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { Sparkles, LayoutDashboard, PlusCircle, CreditCard, LogOut, Wallet, User, Menu, X, Palette, History, Plus, Shield } from 'lucide-react';
import { BRAND_NAME } from '@/config/branding';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { profile, refreshProfile } = useAuth();

  // Tab navigation helper:
  // - Going to Home        → replace (Home tidak perlu numpuk di history)
  // - From Home to others  → push   (agar Home tersimpan, back bisa kembali ke Home)
  // - Between non-Home     → replace (tidak numpuk sesama tab)
  const navigateTab = (href) => {
    if (href === '/') {
      router.replace('/');
    } else if (pathname === '/') {
      router.push(href);
    } else {
      router.replace(href);
    }
  };
  const { activeTheme, handleThemeChange } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { name: 'Landing Pages', href: '/', icon: LayoutDashboard },
    { name: 'Buat Halaman', href: '/generate', icon: PlusCircle },
    { name: 'Profil & Tracking', href: '/profile', icon: User },
    { name: 'Top Up', href: '/topup', icon: CreditCard },
    { name: 'Riwayat Transaksi', href: '/payments/history', icon: History },
  ];

  // Conditionally add admin panel link for admin/super_admin users
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  if (isAdmin) {
    navItems.push({ name: 'Admin Panel', href: '/admin', icon: Shield });
  }

  return (
    <>
      {/* Mobile Top Bar — always visible */}
      <div className="fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 border-b transition-theme"
        style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}>
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center shadow"
            style={{ background: 'linear-gradient(135deg, var(--theme-accent), var(--theme-accent-hover))' }}>
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-black tracking-tight transition-theme" style={{ color: 'var(--theme-text)', fontFamily: "'Sora', sans-serif" }}>
            {BRAND_NAME}
          </span>
        </Link>

        {/* Right side: Balance pill + menu */}
        <div className="flex items-center gap-2">
          {/* Balance Pill */}
          <Link href="/topup" className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-theme hover:scale-105 active:scale-95 cursor-pointer block"
            style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-border-alt)', color: 'var(--theme-accent)' }}>
            {(profile?.balance ?? 0).toLocaleString('id-ID')} Credit
          </Link>
          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg transition-theme md:block hidden"
            style={{ color: 'var(--theme-text-sec)' }}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-45 backdrop-blur-sm transition-opacity"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-in Drawer */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 flex flex-col h-screen transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: 'var(--theme-surface)', borderLeft: '1px solid var(--theme-border)' }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--theme-border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--theme-accent), var(--theme-accent-hover))' }}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-black transition-theme" style={{ color: 'var(--theme-text)', fontFamily: "'Sora', sans-serif" }}>{BRAND_NAME}</span>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ color: 'var(--theme-text-muted)' }}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="m-4 p-4 rounded-xl border transition-theme md:block hidden" style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-border-alt)' }}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--theme-text-muted)' }}>
            <Wallet className="h-3.5 w-3.5" style={{ color: 'var(--theme-accent)' }} />
            <span>Saldo Anda</span>
          </div>
          <div className="text-xl font-bold transition-theme" style={{ color: 'var(--theme-text)', fontFamily: "'Sora', sans-serif" }}>
            {(profile?.balance ?? 0).toLocaleString('id-ID')} Credit
          </div>
          <button
            onClick={refreshProfile}
            className="text-[10px] font-bold mt-2 transition-colors"
            style={{ color: 'var(--theme-accent)' }}
          >
            🔄 Refresh Saldo
          </button>
        </div>

        {/* Theme Selector */}
        <div className="mx-4 mb-4 p-3 rounded-xl border transition-theme md:block hidden" style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-border-alt)' }}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: 'var(--theme-text-muted)' }}>
            <Palette className="h-3.5 w-3.5" style={{ color: 'var(--theme-accent)' }} />
            <span>Pilih Tema</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'clean', label: 'Clean' },
              { id: 'retro', label: 'Retro' },
              { id: 'classic-dark', label: 'Dark' }
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleThemeChange(t.id)}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all border ${
                  activeTheme === t.id
                    ? 'bg-theme-accent border-theme-accent text-theme-accent-text'
                    : 'bg-theme-bg border-theme-border text-theme-text-sec hover:border-theme-text-muted'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-grow px-4 space-y-1 md:block hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all"
                style={{
                  backgroundColor: isActive ? 'var(--theme-accent)' : 'transparent',
                  color: isActive ? 'var(--theme-accent-text)' : 'var(--theme-text-sec)',
                  border: isActive ? 'none' : '1px solid transparent',
                }}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t md:block hidden" style={{ borderColor: 'var(--theme-border)' }}>
          <div className="flex items-center gap-3 px-2 py-2 mb-3">
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-theme"
              style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-border-alt)', color: 'var(--theme-text-sec)' }}>
              <User className="h-4 w-4" />
            </div>
            <div className="flex-grow overflow-hidden">
              <div className="text-xs font-semibold truncate transition-theme" style={{ color: 'var(--theme-text)' }}>
                {profile?.full_name || 'Pengguna'}
              </div>
              <div className="text-[10px] truncate transition-theme" style={{ color: 'var(--theme-text-muted)' }}>
                {profile?.email || ''}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ border: '1px solid var(--theme-border-alt)', color: 'var(--theme-text-muted)' }}
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t transition-theme"
        style={{ 
          backgroundColor: 'var(--theme-surface)', 
          borderColor: 'var(--theme-border)',
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.06)'
        }}>
        <div className="max-w-md mx-auto flex items-center justify-around h-16 relative px-2">
          {/* Home */}
          <button
            type="button"
            onClick={() => navigateTab('/')}
            className="flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 bg-transparent border-0 cursor-pointer"
            style={{ color: pathname === '/' ? 'var(--theme-accent)' : 'var(--theme-text-muted)' }}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-[9px] font-bold mt-1">Home</span>
          </button>

          {/* History */}
          <button
            type="button"
            onClick={() => navigateTab('/payments/history')}
            className="flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 bg-transparent border-0 cursor-pointer"
            style={{ color: pathname === '/payments/history' ? 'var(--theme-accent)' : 'var(--theme-text-muted)' }}
          >
            <History className="h-5 w-5" />
            <span className="text-[9px] font-bold mt-1">History</span>
          </button>

          {/* Landing Page Center FAB */}
          <div className="flex-1 flex justify-center relative h-16">
            <button
              type="button"
              onClick={() => navigateTab('/generate')}
              className="absolute -top-5 flex items-center justify-center h-14 w-14 rounded-full shadow-lg transition-transform active:scale-90 border-4 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, var(--theme-accent), var(--theme-accent-hover))',
                borderColor: 'var(--theme-surface)',
                color: '#ffffff'
              }}
              title="Buat Halaman"
            >
              <Plus className="h-7 w-7 stroke-[3px]" />
            </button>
            <span className="text-[9px] font-bold mt-[42px]" style={{ color: pathname === '/generate' ? 'var(--theme-accent)' : 'var(--theme-text-muted)' }}>
              Landing Page
            </span>
          </div>

          {/* Top-up */}
          <button
            type="button"
            onClick={() => navigateTab('/topup')}
            className="flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 bg-transparent border-0 cursor-pointer"
            style={{ color: pathname === '/topup' ? 'var(--theme-accent)' : 'var(--theme-text-muted)' }}
          >
            <CreditCard className="h-5 w-5" />
            <span className="text-[9px] font-bold mt-1">Top-up</span>
          </button>

          {/* Profil */}
          <button
            type="button"
            onClick={() => navigateTab('/profile')}
            className="flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 bg-transparent border-0 cursor-pointer"
            style={{ color: pathname === '/profile' ? 'var(--theme-accent)' : 'var(--theme-text-muted)' }}
          >
            <User className="h-5 w-5" />
            <span className="text-[9px] font-bold mt-1">Profil</span>
          </button>
        </div>
      </div>
    </>
  );
}
