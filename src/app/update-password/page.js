'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Lock, ArrowRight } from 'lucide-react';

export default function UpdatePasswordPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in and not loading
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1510]">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-[#f5a623]/20 border-t-[#f5a623] animate-spin"></div>
        </div>
      </div>
    );
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 6) {
      setError('Password baru harus minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setMessage('Password Anda berhasil diperbarui! Mengalihkan ke dashboard...');
      setTimeout(() => {
        router.push('/');
      }, 2500);
    } catch (err) {
      setError(err.message || 'Gagal memperbarui password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-bg relative overflow-hidden px-4 transition-theme">
      {/* Decorative Warm Theme Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-theme-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-theme-accent-hover/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-sm bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-2xl relative z-10 transition-theme">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-11 w-11 rounded-xl flex items-center justify-center shadow-md mb-3.5"
            style={{ background: 'linear-gradient(135deg, var(--theme-accent), var(--theme-accent-hover))' }}>
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-black text-theme-text tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
            Perbarui Password
          </h1>
          <p className="text-xs text-theme-text-sec mt-1.5 leading-relaxed">
            Masukkan password baru Anda di bawah ini
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3 mb-5">
            {error}
          </div>
        )}

        {/* Success message */}
        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg p-3 mb-5">
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2">
              Password Baru
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-theme-text-muted" />
              </span>
              <input
                type="password"
                required
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-9 pr-3.5 py-2.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2">
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-theme-text-muted" />
              </span>
              <input
                type="password"
                required
                placeholder="Ulangi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-9 pr-3.5 py-2.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || message !== ''}
            className="w-full mt-2 bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text font-black text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 rounded-full border-2 border-theme-accent-text/20 border-t-theme-accent-text animate-spin"></div>
            ) : (
              <>
                <span>Simpan Password Baru</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
