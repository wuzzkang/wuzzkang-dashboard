'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
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

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        // Sign up with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;
        
        if (data?.user?.identities?.length === 0) {
          setAuthError('Email ini sudah terdaftar. Silakan login.');
        } else {
          setMessage('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi atau langsung login jika konfirmasi email dinonaktifkan.');
        }
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        router.push('/');
      }
    } catch (err) {
      setAuthError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1510] relative overflow-hidden px-4">
      {/* Decorative Warm Retro Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f5a623]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#c0623a]/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-sm bg-[#221d16] border border-[#3d3328] rounded-2xl p-6 shadow-2xl relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-11 w-11 rounded-xl flex items-center justify-center shadow-md mb-3.5"
            style={{ background: 'linear-gradient(135deg, var(--retro-amber), var(--retro-rust))' }}>
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
            Siluet
          </h1>
          <p className="text-xs text-[#c9b899] mt-1.5 leading-relaxed">
            {isSignUp ? 'Buat akun untuk memulai generate landing page' : 'Masuk ke dashboard akun Anda'}
          </p>
        </div>

        {/* Auth Error Notification */}
        {authError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3 mb-5">
            {authError}
          </div>
        )}

        {/* Success message */}
        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg p-3 mb-5">
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-[10px] font-bold text-[#c9b899] uppercase tracking-wider mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-[#7a6a55]" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Nama Anda"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-9 pr-3.5 py-2.5 bg-[#1a1510] border border-[#3d3328] focus:border-[#f5a623] rounded-xl text-xs text-white placeholder-[#7a6a55] focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-[#c9b899] uppercase tracking-wider mb-2">
              Alamat Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-[#7a6a55]" />
              </span>
              <input
                type="email"
                required
                placeholder="nama@perusahaan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-9 pr-3.5 py-2.5 bg-[#1a1510] border border-[#3d3328] focus:border-[#f5a623] rounded-xl text-xs text-white placeholder-[#7a6a55] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#c9b899] uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-[#7a6a55]" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-9 pr-3.5 py-2.5 bg-[#1a1510] border border-[#3d3328] focus:border-[#f5a623] rounded-xl text-xs text-white placeholder-[#7a6a55] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-[#f5a623] hover:bg-[#e8951a] text-[#1a1510] font-black text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 rounded-full border-2 border-[#1a1510]/20 border-t-[#1a1510] animate-spin"></div>
            ) : (
              <>
                <span>{isSignUp ? 'Daftar Sekarang' : 'Masuk Dashboard'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle link */}
        <div className="mt-6 text-center text-xs text-[#c9b899]">
          {isSignUp ? (
            <p>
              Sudah punya akun?{' '}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-[#f5a623] font-bold hover:underline"
              >
                Log In
              </button>
            </p>
          ) : (
            <p>
              Belum punya akun?{' '}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-[#f5a623] font-bold hover:underline"
              >
                Daftar Baru
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
