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
    { name: 'Buat Halaman Baru', href: '/generate', icon: PlusCircle },
    { name: 'Top Up Saldo', href: '/topup', icon: CreditCard },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-40">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Siluet</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-400 hover:text-slate-200 focus:outline-none rounded-lg hover:bg-slate-800 transition-colors"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-45 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen transition-transform duration-300 transform md:translate-x-0 md:static ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col flex-grow">
          {/* Brand & Mobile Close */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
              <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/10">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Siluet</span>
            </Link>
            <button
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Balance Card */}
          <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Wallet className="h-3.5 w-3.5 text-indigo-400" />
              <span>Saldo Anda</span>
            </div>
            <div className="text-xl font-bold text-white tracking-wide">
              Rp {(profile?.balance ?? 0).toLocaleString('id-ID')}
            </div>
            <button 
              onClick={refreshProfile}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium mt-2 transition-colors block text-left"
            >
              🔄 Refresh Saldo
            </button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5 flex-grow">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 px-2 py-2 mb-3">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-300 text-sm font-semibold">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-grow overflow-hidden">
              <div className="text-xs font-semibold text-slate-300 truncate">
                {profile?.full_name || 'Pengguna'}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {profile?.email || ''}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/20 transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
