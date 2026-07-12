'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Lock, ArrowRight } from 'lucide-react';
import IconInput from '@/components/IconInput';
import AlertBanner from '@/components/AlertBanner';
import Loading from '@/components/Loading';

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
    return <Loading fullScreen />;
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
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-theme-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-theme-accent-hover/5 rounded-full blur-3xl" />

      <div className="w-full max-w-sm bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-2xl relative z-10 transition-theme">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div
            className="h-11 w-11 rounded-xl flex items-center justify-center shadow-md mb-3.5"
            style={{ background: 'linear-gradient(135deg, var(--theme-accent), var(--theme-accent-hover))' }}
          >
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1
            className="text-xl font-black text-theme-text tracking-tight"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Perbarui Password
          </h1>
          <p className="text-xs text-theme-text-sec mt-1.5 leading-relaxed">
            Masukkan password baru Anda di bawah ini
          </p>
        </div>

        <AlertBanner type="error" message={error} className="mb-5" />
        <AlertBanner type="success" message={message} className="mb-5" />

        {/* Form */}
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2">
              Password Baru
            </label>
            <IconInput
              icon={<Lock className="h-4 w-4" />}
              type="password"
              required
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2">
              Konfirmasi Password Baru
            </label>
            <IconInput
              icon={<Lock className="h-4 w-4" />}
              type="password"
              required
              placeholder="Ulangi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || message !== ''}
            className="w-full mt-2 bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text font-black text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 rounded-full border-2 border-theme-accent-text/20 border-t-theme-accent-text animate-spin" />
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
