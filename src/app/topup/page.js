'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import { CreditCard, ArrowRight, CheckCircle, AlertCircle, RefreshCw, Smartphone } from 'lucide-react';

export default function TopUpPage() {
  const { user, session, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();

  // Input states
  const [amount, setAmount] = useState(50000);
  const [channel, setChannel] = useState('BCA');

  // App states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || (!user && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="h-12 w-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  const presetAmounts = [20000, 50000, 100000, 250000];
  const paymentChannels = [
    { code: 'BCA', name: 'BCA Virtual Account' },
    { code: 'MANDIRI', name: 'Mandiri Virtual Account' },
    { code: 'BNI', name: 'BNI Virtual Account' },
    { code: 'BRI', name: 'BRI Virtual Account' },
  ];

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    if (!amount || amount < 10000) {
      setError('Minimal top up adalah Rp 10.000');
      return;
    }

    setError('');
    setIsSubmitting(true);
    setActiveTransaction(null);
    setSuccessMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          userId: profile.id,
          channel,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setActiveTransaction(result);
      } else {
        setError(result.error || 'Gagal membuat tagihan pembayaran.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate payment completion via webhook (Local Dev Flow)
  const handleSimulatePayment = async () => {
    if (!activeTransaction) return;

    setError('');
    setIsSimulating(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-signature': 'dummy-signature',
        },
        body: JSON.stringify({
          trxId: activeTransaction.order_id,
          responseCode: '2000000',
          paidAmount: {
            value: activeTransaction.amount.toString(),
          },
        }),
      });

      if (response.ok) {
        setSuccessMessage(`Berhasil simulasi pembayaran! Saldo Rp ${activeTransaction.amount.toLocaleString('id-ID')} telah ditambahkan.`);
        setActiveTransaction(null);
        await refreshProfile(); // Refresh balance
      } else {
        setError('Gagal mensimulasikan pembayaran.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan saat simulasi.');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg flex flex-col transition-theme">
      <Sidebar />

      {/* Main Content - Mobile-First */}
      <main className="flex-grow p-4 flex flex-col min-h-screen pt-20 pb-28 max-w-md mx-auto w-full bg-theme-surface border-x border-theme-border relative transition-theme">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-theme-text tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>Top Up Saldo</h1>
          <p className="text-theme-text-sec text-xs mt-1">Tambah saldo Siluet untuk mendeploy website landing page Anda</p>
        </div>

        <div className="space-y-6">
          {/* Form Top Up */}
          <div className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3.5 flex gap-2.5 items-start">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl p-3.5 flex gap-2.5 items-start">
                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {!activeTransaction ? (
              <div className="bg-theme-card/40 border border-theme-border rounded-2xl p-5">
                <form onSubmit={handleCreatePayment} className="space-y-5">
                  {/* Amount Selection */}
                  <div>
                    <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2.5">
                      Pilih Nominal Saldo
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {presetAmounts.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setAmount(amt)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                            amount === amt
                              ? 'bg-theme-accent border-theme-accent-hover text-theme-accent-text shadow-md'
                              : 'bg-theme-bg border-theme-border text-theme-text-sec hover:border-theme-text-muted'
                          }`}
                        >
                          Rp {amt.toLocaleString('id-ID')}
                        </button>
                      ))}
                    </div>

                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-theme-text-muted text-xs font-semibold">Rp</span>
                      <input
                        type="number"
                        required
                        min={10000}
                        placeholder="Masukkan nominal lain..."
                        value={amount || ''}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        disabled={isSubmitting}
                        className="block w-full pl-9 pr-3.5 py-2.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Channel Selection */}
                  <div>
                    <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2.5">
                      Metode Pembayaran (Virtual Account)
                    </label>
                    <div className="space-y-2">
                      {paymentChannels.map((ch) => (
                        <button
                          key={ch.code}
                          type="button"
                          onClick={() => setChannel(ch.code)}
                          className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold border flex items-center justify-between transition-all ${
                            channel === ch.code
                              ? 'bg-theme-accent border-theme-accent-hover text-theme-accent-text shadow-md'
                              : 'bg-theme-bg border-theme-border text-theme-text-sec hover:border-theme-text-muted'
                          }`}
                        >
                          <span>{ch.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                            channel === ch.code
                              ? 'bg-theme-bg/15 border border-theme-bg/10 text-theme-accent-text'
                              : 'bg-theme-bg border border-theme-border text-theme-accent'
                          }`}>
                            {ch.code}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !amount}
                    className="w-full bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text font-black text-xs py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Membuat Invoice Pembayaran...</span>
                      </>
                    ) : (
                      <>
                        <span>Lanjut ke Pembayaran</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Menampilkan VA Number */
              <div className="bg-theme-card/40 border border-theme-border rounded-2xl p-5 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-theme-text mb-0.5" style={{ fontFamily: "'Sora', sans-serif" }}>Menunggu Pembayaran</h3>
                  <p className="text-[10px] text-theme-text-sec">Silakan lakukan transfer ke nomor Virtual Account di bawah</p>
                </div>

                <div className="bg-theme-bg border border-theme-border rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-theme-text-sec">
                    <span>Order ID:</span>
                    <span className="font-mono text-theme-text">{activeTransaction.order_id}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] font-semibold text-theme-text-sec">
                    <span>Nominal Pembayaran:</span>
                    <span className="text-theme-text text-sm font-bold">
                      Rp {activeTransaction.amount.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="border-t border-theme-border pt-3.5 flex flex-col gap-1">
                    <span className="text-[9px] text-theme-text-muted uppercase tracking-wider font-bold">Nomor Virtual Account ({channel})</span>
                    <span className="text-xl font-mono font-extrabold text-theme-accent tracking-wide select-all">
                      {(activeTransaction.va_number || '').trim() || '88301234567890'}
                    </span>
                  </div>
                </div>

                {/* Local Dev Simulator Helper */}
                <div className="bg-theme-accent/5 border border-theme-accent/10 rounded-xl p-4 space-y-2">
                  <div className="flex gap-2 items-center text-[10px] font-bold text-theme-accent uppercase tracking-wider">
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>Simulator Pembayaran (Lokal Dev)</span>
                  </div>
                  <p className="text-[10px] text-theme-text-sec leading-relaxed">
                    Karena Anda berada di lingkungan pengembangan lokal, Anda dapat langsung menyimulasikan konfirmasi pembayaran sukses tanpa perlu mentransfer uang asli.
                  </p>
                  <button
                    onClick={handleSimulatePayment}
                    disabled={isSimulating}
                    className="w-full mt-1 bg-theme-accent/80 hover:bg-theme-accent text-theme-accent-text font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isSimulating ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Memproses Simulasi...</span>
                      </>
                    ) : (
                      <span>Simulasikan Bayar Sukses</span>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => setActiveTransaction(null)}
                  className="w-full border border-theme-border text-theme-text-sec hover:text-theme-text font-semibold text-xs py-2.5 px-4 rounded-xl transition-all"
                >
                  Batal / Kembali
                </button>
              </div>
            )}
          </div>

          {/* Pricing Info Card */}
          <div className="bg-theme-card/40 border border-theme-border rounded-2xl p-5">
            <h3 className="text-xs font-bold text-theme-text mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>Informasi Biaya</h3>
            <ul className="space-y-3 text-xs text-theme-text-sec">
              <li className="flex justify-between items-center py-1.5 border-b border-theme-border">
                <span>Generate Landing Page AI</span>
                <span className="font-semibold text-emerald-400">Gratis (Draft)</span>
              </li>
              <li className="flex justify-between items-center py-1.5 border-b border-theme-border">
                <span>Publikasi Website</span>
                <span className="font-semibold text-theme-text">Rp 10.000 / Halaman</span>
              </li>
              <li className="flex justify-between items-center py-1.5 border-b border-theme-border">
                <span>Hosting Website</span>
                <span className="font-semibold text-emerald-400">Selamanya Gratis</span>
              </li>
              <li className="flex justify-between items-center py-1.5">
                <span>SSL & Custom Domain</span>
                <span className="font-semibold text-theme-text">Segera Hadir</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
