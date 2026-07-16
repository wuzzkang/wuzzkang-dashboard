'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { BRAND_NAME } from '@/config/branding';
import IconInput from '@/components/IconInput';
import AlertBanner from '@/components/AlertBanner';
import Loading from '@/components/Loading';

export default function LoginPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('[LoginPage] loading:', loading, 'user exists:', !!user, 'profile exists:', !!profile);
    if (!loading && user && profile) {
      if (profile.is_active === false) {
        return;
      }
      console.log('[LoginPage] Redirecting to /');
      router.push('/');
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('error') === 'suspended') {
        setAuthError('Akun Anda telah dinonaktifkan oleh administrator.');
      }
    }
  }, []);

  if (loading) {
    return <Loading fullScreen />;
  }

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/update-password`,
        });
        if (error) throw error;
        setMessage('Link reset password berhasil dikirim! Silakan periksa kotak masuk email Anda.');
      } else if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });

        if (error) throw error;

        if (data?.user?.identities?.length === 0) {
          setAuthError('Email ini sudah terdaftar. Silakan login.');
        } else {
          setMessage('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi atau langsung login jika konfirmasi email dinonaktifkan.');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Quick verification of account status before redirecting to '/'
        if (data?.session?.access_token) {
          const resProfile = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
            headers: { Authorization: `Bearer ${data.session.access_token}` },
          });
          
          if (!resProfile.ok) {
            const body = await resProfile.json().catch(() => ({}));
            if (resProfile.status === 403 && body?.error && body.error.toLowerCase().includes('suspended')) {
              await supabase.auth.signOut();
              throw new Error('Akun Anda telah dinonaktifkan oleh administrator.');
            }
          }
        }

        router.push('/');
      }
    } catch (err) {
      setAuthError(err.message || 'Terjadi kesalahan sistem.');
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
            className="text-2xl font-black text-theme-text tracking-tight animate-pulse"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {isForgotPassword ? 'Reset Password' : BRAND_NAME}
          </h1>
          <p className="text-xs text-theme-text-sec mt-1.5 leading-relaxed">
            {isForgotPassword
              ? 'Masukkan email Anda untuk menerima link reset password'
              : isSignUp
              ? 'Buat akun untuk memulai generate landing page'
              : 'Masuk ke dashboard akun Anda'}
          </p>
        </div>

        <AlertBanner type="error" message={authError} className="mb-5" />
        <AlertBanner type="success" message={message} className="mb-5" />

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && !isForgotPassword && (
            <div>
              <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2">
                Nama Lengkap
              </label>
              <IconInput
                icon={<User className="h-4 w-4" />}
                type="text"
                required
                placeholder="Nama Anda"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2">
              Alamat Email
            </label>
            <IconInput
              icon={<Mail className="h-4 w-4" />}
              type="email"
              required
              placeholder="nama@perusahaan.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {!isForgotPassword && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setAuthError('');
                      setMessage('');
                    }}
                    className="text-[10px] font-semibold text-theme-accent hover:underline focus:outline-none"
                  >
                    Lupa password?
                  </button>
                )}
              </div>
              <IconInput
                icon={<Lock className="h-4 w-4" />}
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text font-black text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 rounded-full border-2 border-theme-accent-text/20 border-t-theme-accent-text animate-spin" />
            ) : (
              <>
                <span>
                  {isForgotPassword
                    ? 'Kirim Link Reset'
                    : isSignUp
                    ? 'Daftar Sekarang'
                    : 'Masuk Dashboard'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle link */}
        <div className="mt-6 text-center text-xs text-theme-text-sec">
          {isForgotPassword ? (
            <p>
              Sudah ingat password?{' '}
              <button
                onClick={() => {
                  setIsForgotPassword(false);
                  setAuthError('');
                  setMessage('');
                }}
                className="text-theme-accent font-bold hover:underline"
              >
                Log In
              </button>
            </p>
          ) : isSignUp ? (
            <p>
              Sudah punya akun?{' '}
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setAuthError('');
                  setMessage('');
                }}
                className="text-theme-accent font-bold hover:underline"
              >
                Log In
              </button>
            </p>
          ) : (
            <p>
              Belum punya akun?{' '}
              <button
                onClick={() => {
                  setIsSignUp(true);
                  setAuthError('');
                  setMessage('');
                }}
                className="text-theme-accent font-bold hover:underline"
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
