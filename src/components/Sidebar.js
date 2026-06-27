'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, LayoutDashboard, PlusCircle, CreditCard, LogOut, Wallet, User, Menu, X } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { profile, refreshProfile } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { name: 'Landing Pages', href: '/', icon: LayoutDashboard },
    { name: 'Buat Halaman', href: '/generate', icon: PlusCircle },
    { name: 'Top Up', href: '/topup', icon: CreditCard },
  ];

  return (
    <>
      {/* Mobile Top Bar — always visible */}
      <div className="fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 border-b"
        style={{ backgroundColor: 'var(--retro-surface)', borderColor: 'var(--retro-border)' }}>
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center shadow"
            style={{ background: 'linear-gradient(135deg, var(--retro-amber), var(--retro-rust))' }}>
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight" style={{ color: 'var(--retro-cream)', fontFamily: "'Sora', sans-serif" }}>
            Siluet
          </span>
        </Link>

        {/* Right side: Balance pill + menu */}
        <div className="flex items-center gap-2">
          {/* Balance Pill */}
          <div className="px-3 py-1.5 rounded-lg text-xs font-semibold border"
            style={{ backgroundColor: 'var(--retro-card)', borderColor: 'var(--retro-border-2)', color: 'var(--retro-amber)' }}>
            Rp {(profile?.balance ?? 0).toLocaleString('id-ID')}
          </div>
          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--retro-cream-2)' }}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-45 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(26,21,16,0.7)' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-in Drawer */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 flex flex-col h-screen transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: 'var(--retro-surface)', borderLeft: '1px solid var(--retro-border)' }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--retro-border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--retro-amber), var(--retro-rust))' }}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold" style={{ color: 'var(--retro-cream)', fontFamily: "'Sora', sans-serif" }}>Siluet</span>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ color: 'var(--retro-muted)' }}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="m-4 p-4 rounded-xl border" style={{ backgroundColor: 'var(--retro-card)', borderColor: 'var(--retro-border-2)' }}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--retro-muted)' }}>
            <Wallet className="h-3.5 w-3.5" style={{ color: 'var(--retro-amber)' }} />
            <span>Saldo Anda</span>
          </div>
          <div className="text-xl font-bold" style={{ color: 'var(--retro-cream)', fontFamily: "'Sora', sans-serif" }}>
            Rp {(profile?.balance ?? 0).toLocaleString('id-ID')}
          </div>
          <button
            onClick={refreshProfile}
            className="text-[10px] font-medium mt-2 transition-colors"
            style={{ color: 'var(--retro-amber)' }}
          >
            🔄 Refresh Saldo
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-grow px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  backgroundColor: isActive ? 'var(--retro-amber)' : 'transparent',
                  color: isActive ? '#1a1510' : 'var(--retro-cream-2)',
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
        <div className="p-4 border-t" style={{ borderColor: 'var(--retro-border)' }}>
          <div className="flex items-center gap-3 px-2 py-2 mb-3">
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold"
              style={{ backgroundColor: 'var(--retro-card)', border: '1px solid var(--retro-border-2)', color: 'var(--retro-cream-2)' }}>
              <User className="h-4 w-4" />
            </div>
            <div className="flex-grow overflow-hidden">
              <div className="text-xs font-semibold truncate" style={{ color: 'var(--retro-cream)' }}>
                {profile?.full_name || 'Pengguna'}
              </div>
              <div className="text-[10px] truncate" style={{ color: 'var(--retro-muted)' }}>
                {profile?.email || ''}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ border: '1px solid var(--retro-border-2)', color: 'var(--retro-muted)' }}
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
