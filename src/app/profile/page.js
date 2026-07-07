'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  User, Mail, Shield, Radio, Save, Check, AlertCircle, Eye, EyeOff,
  BarChart2, Target, Music2, ExternalLink, Loader2, KeyRound, Palette, LogOut
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Custom inline Facebook icon for older/custom lucide-react compatibility
const FacebookIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

// ─── Provider icon & label map ───────────────────────────────────────────────
const TRACKING_FIELDS = [
  {
    key: 'facebook_pixel_id',
    label: 'Facebook / Meta Pixel ID',
    placeholder: 'e.g. 1234567890',
    hint: 'Temukan di Meta Events Manager → Pixel → Overview',
    Icon: FacebookIcon,
    color: '#1877F2',
    helpUrl: 'https://www.facebook.com/events_manager',
  },
  {
    key: 'google_analytics_id',
    label: 'Google Analytics 4 (Measurement ID)',
    placeholder: 'e.g. G-XXXXXXXXXX',
    hint: 'Temukan di Google Analytics → Admin → Data Streams',
    Icon: BarChart2,
    color: '#E37400',
    helpUrl: 'https://analytics.google.com',
  },
  {
    key: 'google_ads_id',
    label: 'Google Ads Conversion Tag ID',
    placeholder: 'e.g. AW-XXXXXXXXXX',
    hint: 'Temukan di Google Ads → Goals → Conversions → Tag setup',
    Icon: Target,
    color: '#4285F4',
    helpUrl: 'https://ads.google.com',
  },
  {
    key: 'tiktok_pixel_id',
    label: 'TikTok Pixel ID',
    placeholder: 'e.g. CXXXXXXXXXXXXXXXXX',
    hint: 'Temukan di TikTok Ads Manager → Assets → Events',
    Icon: Music2,
    color: '#010101',
    helpUrl: 'https://ads.tiktok.com',
  },
];

export default function ProfilePage() {
  const { user, session, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();

  const [profileData, setProfileData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  // Theme state
  const [activeTheme, setActiveTheme] = useState('clean');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'clean';
    setActiveTheme(savedTheme);
  }, []);

  const handleThemeChange = (newTheme) => {
    setActiveTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    window.dispatchEvent(new Event('themeChange'));
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Apakah Anda yakin ingin keluar dari akun?');
    if (!confirmLogout) return;

    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (e) {
      alert('Gagal melakukan logout.');
    }
  };

  // Password reset
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Tracking config form
  const [trackingForm, setTrackingForm] = useState({
    facebook_pixel_id: '',
    google_analytics_id: '',
    google_ads_id: '',
    tiktok_pixel_id: '',
  });
  const [isSavingTracking, setIsSavingTracking] = useState(false);
  const [trackingSaveResult, setTrackingSaveResult] = useState(null); // 'success' | 'error'
  const [trackingError, setTrackingError] = useState('');

  // Visibility toggles for pixel IDs
  const [visibleFields, setVisibleFields] = useState({});

  // Anchor for #tracking hash navigation
  const trackingRef = useRef(null);

  // ── Auth guard ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // ── Fetch full profile (includes tracking_config) ───────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session) return;
      try {
        setIsFetching(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) throw new Error('Failed to load profile');
        const result = await res.json();
        const data = result.data;
        setProfileData(data);
        const tc = data?.tracking_config || {};
        setTrackingForm({
          facebook_pixel_id:   tc.facebook_pixel_id   || '',
          google_analytics_id: tc.google_analytics_id || '',
          google_ads_id:       tc.google_ads_id       || '',
          tiktok_pixel_id:     tc.tiktok_pixel_id     || '',
        });
      } catch (e) {
        // keep default empty state
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, [session]);

  // ── Hash scroll to #tracking ────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#tracking') {
      setTimeout(() => {
        trackingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }
  }, [isFetching]);

  // ── Password reset handler ───────────────────────────────────────────────
  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setIsResettingPassword(true);
    setPasswordError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      setPasswordResetSent(true);
    } catch (e) {
      setPasswordError(e.message || 'Gagal mengirim email reset password.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  // ── Save tracking config ─────────────────────────────────────────────────
  const handleSaveTracking = async (e) => {
    e.preventDefault();
    setIsSavingTracking(true);
    setTrackingSaveResult(null);
    setTrackingError('');
    try {
      const payload = {
        facebook_pixel_id:   trackingForm.facebook_pixel_id   || null,
        google_analytics_id: trackingForm.google_analytics_id || null,
        google_ads_id:       trackingForm.google_ads_id       || null,
        tiktok_pixel_id:     trackingForm.tiktok_pixel_id     || null,
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/tracking`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal menyimpan');
      setTrackingSaveResult('success');
      setTimeout(() => setTrackingSaveResult(null), 3000);
    } catch (e) {
      setTrackingError(e.message || 'Terjadi kesalahan.');
      setTrackingSaveResult('error');
      setTimeout(() => setTrackingSaveResult(null), 4000);
    } finally {
      setIsSavingTracking(false);
    }
  };

  const toggleFieldVisibility = (key) => {
    setVisibleFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Guard: not yet loaded ────────────────────────────────────────────────
  if (loading || isFetching) {
    return (
      <div className="min-h-screen bg-theme-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-theme-accent animate-spin" />
          <p className="text-theme-text-muted text-sm">Memuat profil...</p>
        </div>
      </div>
    );
  }

  const displayName = profileData?.full_name || user?.email?.split('@')[0] || 'Pengguna';
  const avatarChar  = displayName.charAt(0).toUpperCase();
  const balanceCredits = profileData?.balance ?? 0;
  const remainingFree  = profileData?.remainingFree ?? 0;
  const dailyLimit     = profileData?.daily_ai_limit ?? 15;

  return (
    <div className="min-h-screen bg-theme-bg transition-theme" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <Sidebar />
      <main className="max-w-md mx-auto px-4 pb-24 pt-6">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-theme-text">Profil Saya</h1>
          <p className="text-theme-text-muted text-sm mt-1">Kelola akun, keamanan, dan pengaturan pelacakan</p>
        </div>

        {/* ── Account Info Card ───────────────────────────────────────────── */}
        <section className="bg-theme-surface border border-theme-border rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="h-16 w-16 rounded-2xl bg-theme-accent flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-md">
              {profileData?.avatar_url ? (
                <img src={profileData.avatar_url} alt={displayName} className="h-full w-full object-cover rounded-2xl" />
              ) : (
                avatarChar
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-theme-text truncate">{displayName}</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <Mail className="h-3.5 w-3.5 text-theme-text-muted shrink-0" />
                <span className="text-sm text-theme-text-sec truncate">{profileData?.email || user?.email}</span>
              </div>
            </div>
          </div>

          {/* Balance + Quota */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-theme-bg rounded-xl p-3 border border-theme-border relative">
              <p className="text-xs text-theme-text-muted mb-1 flex justify-between items-center">
                <span>Saldo Kredit</span>
                <button
                  type="button"
                  onClick={refreshProfile}
                  className="text-[10px] text-theme-accent hover:underline leading-none p-0.5 rounded hover:bg-theme-card transition-all"
                  title="Refresh Saldo"
                >
                  🔄
                </button>
              </p>
              <p className="text-xl font-black text-theme-accent">{balanceCredits.toLocaleString()}</p>
              <p className="text-xs text-theme-text-muted">Credit</p>
            </div>
            <div className="bg-theme-bg rounded-xl p-3 border border-theme-border">
              <p className="text-xs text-theme-text-muted mb-1">Kuota AI Gratis</p>
              <p className="text-xl font-black text-theme-text">{remainingFree}<span className="text-sm font-normal text-theme-text-muted">/{dailyLimit}</span></p>
              <p className="text-xs text-theme-text-muted">sisa hari ini</p>
            </div>
          </div>
        </section>

        {/* ── Theme Selector Card ────────────────────────────────────────── */}
        <section className="bg-theme-surface border border-theme-border rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Palette className="h-4 w-4 text-indigo-500" />
            </div>
            <h3 className="font-bold text-theme-text">Tema Aplikasi</h3>
          </div>
          <p className="text-sm text-theme-text-sec mb-3">
            Pilih tampilan warna dashboard yang paling nyaman bagi Anda.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'clean', label: 'Clean' },
              { id: 'retro', label: 'Retro' },
              { id: 'classic-dark', label: 'Dark' }
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleThemeChange(t.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center ${
                  activeTheme === t.id
                    ? 'bg-theme-accent border-theme-accent text-theme-accent-text font-black shadow-sm'
                    : 'bg-theme-bg border-theme-border text-theme-text-sec hover:border-theme-text-muted hover:bg-theme-card/30'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Security Card ───────────────────────────────────────────────── */}
        <section className="bg-theme-surface border border-theme-border rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-yellow-500" />
            </div>
            <h3 className="font-bold text-theme-text">Keamanan</h3>
          </div>

          {passwordResetSent ? (
            <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-3.5">
              <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-400">Email reset dikirim!</p>
                <p className="text-xs text-theme-text-muted mt-0.5">Cek inbox <span className="font-medium">{user?.email}</span> untuk link ubah password.</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-theme-text-sec mb-3">
                Untuk mengubah password, kami akan mengirimkan link reset ke email Anda.
              </p>
              {passwordError && (
                <div className="flex items-center gap-2 text-red-400 text-xs mb-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}
              <button
                onClick={handlePasswordReset}
                disabled={isResettingPassword}
                id="btn-reset-password"
                className="flex items-center gap-2 text-sm font-semibold text-theme-accent border border-theme-accent/40 hover:bg-theme-accent/10 px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isResettingPassword ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="h-4 w-4" />
                )}
                Kirim Link Ubah Password
              </button>
            </div>
          )}
        </section>

        {/* ── Tracking & Pixel Card ───────────────────────────────────────── */}
        <section
          id="tracking"
          ref={trackingRef}
          className="bg-theme-surface border border-theme-border rounded-2xl p-5 shadow-sm scroll-mt-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-lg bg-theme-accent/10 flex items-center justify-center">
              <Radio className="h-4 w-4 text-theme-accent" />
            </div>
            <h3 className="font-bold text-theme-text">Tracking & Pixel</h3>
          </div>
          <p className="text-xs text-theme-text-muted mb-5 ml-10">
            Simpan sekali, otomatis aktif di semua landing page Anda — termasuk domain custom jika nanti dikonfigurasi.
          </p>

          <form id="tracking-form" onSubmit={handleSaveTracking} className="space-y-4">
            {TRACKING_FIELDS.map(({ key, label, placeholder, hint, Icon, color, helpUrl }) => {
              const isVisible = !!visibleFields[key];
              const hasValue  = !!trackingForm[key];
              return (
                <div key={key}>
                  <label htmlFor={`field-${key}`} className="flex items-center gap-2 text-xs font-semibold text-theme-text-sec mb-1.5">
                    <Icon className="h-3.5 w-3.5 shrink-0" style={{ color }} />
                    {label}
                    <a
                      href={helpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-theme-text-muted/60 hover:text-theme-accent transition-colors"
                      title={`Buka ${label}`}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </label>
                  <div className="relative">
                    <input
                      id={`field-${key}`}
                      type={isVisible || !hasValue ? 'text' : 'password'}
                      value={trackingForm[key]}
                      onChange={(e) => setTrackingForm((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      maxLength={100}
                      autoComplete="off"
                      className="w-full bg-theme-bg border border-theme-border text-theme-text placeholder:text-theme-text-muted/60 rounded-xl px-3.5 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent transition-colors"
                    />
                    {hasValue && (
                      <button
                        type="button"
                        onClick={() => toggleFieldVisibility(key)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-text-muted hover:text-theme-text transition-colors"
                      >
                        {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-theme-text-muted/70 mt-1 ml-0.5">{hint}</p>
                </div>
              );
            })}

            {/* Save result feedback */}
            {trackingSaveResult === 'success' && (
              <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-xl px-3.5 py-2.5">
                <Check className="h-4 w-4 shrink-0" />
                <span>Berhasil disimpan! Pixel akan aktif di semua landing page berikutnya.</span>
              </div>
            )}
            {trackingSaveResult === 'error' && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-3.5 py-2.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{trackingError || 'Gagal menyimpan. Coba lagi.'}</span>
              </div>
            )}

            <button
              type="submit"
              id="btn-save-tracking"
              disabled={isSavingTracking}
              className="w-full bg-theme-accent hover:bg-theme-accent-hover disabled:opacity-50 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              {isSavingTracking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* ── Logout Button ──────────────────────────────────────────────── */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 hover:text-red-400 border border-red-500/20 font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Keluar dari Akun</span>
          </button>
        </div>

      </main>
    </div>
  );
}
