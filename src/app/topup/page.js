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
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Top Up Saldo</h1>
          <p className="text-slate-400 text-sm mt-1">Tambah saldo WuzzKang untuk mendeploy website landing page Anda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Top Up */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-4 flex gap-2.5 items-start">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl p-4 flex gap-2.5 items-start">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {!activeTransaction ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <form onSubmit={handleCreatePayment} className="space-y-6">
                  {/* Amount Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Pilih Nominal Saldo
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {presetAmounts.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setAmount(amt)}
                          className={`py-3 px-4 rounded-xl text-sm font-semibold border transition-all ${
                            amount === amt
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/15'
                              : 'bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          Rp {amt.toLocaleString('id-ID')}
                        </button>
                      ))}
                    </div>

                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-slate-500 text-sm font-medium">Rp</span>
                      <input
                        type="number"
                        required
                        min={10000}
                        placeholder="Masukkan nominal lain..."
                        value={amount || ''}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        disabled={isSubmitting}
                        className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Channel Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Metode Pembayaran (Virtual Account)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {paymentChannels.map((ch) => (
                        <button
                          key={ch.code}
                          type="button"
                          onClick={() => setChannel(ch.code)}
                          className={`py-3 px-4 rounded-xl text-sm font-semibold border flex items-center justify-between transition-all ${
                            channel === ch.code
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/15'
                              : 'bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span>{ch.name}</span>
                          <span className="text-[10px] bg-slate-900 border border-slate-850 text-indigo-400 px-2 py-0.5 rounded font-mono">
                            {ch.code}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !amount}
                    className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
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
              <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Menunggu Pembayaran</h3>
                  <p className="text-xs text-slate-400">Silakan lakukan transfer ke nomor Virtual Account di bawah</p>
                </div>

                <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                    <span>Order ID:</span>
                    <span className="font-mono text-white">{activeTransaction.order_id}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                    <span>Nominal Pembayaran:</span>
                    <span className="text-white text-base font-bold">
                      Rp {activeTransaction.amount.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="border-t border-slate-850/80 pt-4 flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Nomor Virtual Account ({channel})</span>
                    <span className="text-2xl font-mono font-extrabold text-indigo-400 tracking-wide select-all">
                      {(activeTransaction.va_number || '').trim() || '88301234567890'}
                    </span>
                  </div>
                </div>

                {/* Local Dev Simulator Helper */}
                <div className="bg-amber-950/10 border border-amber-900/20 rounded-xl p-5 space-y-3">
                  <div className="flex gap-2 items-center text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <Smartphone className="h-4 w-4" />
                    <span>Simulator Pembayaran (Lokal Dev)</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Karena Anda berada di lingkungan pengembangan lokal, Anda dapat langsung menyimulasikan konfirmasi pembayaran sukses tanpa perlu mentransfer uang asli.
                  </p>
                  <button
                    onClick={handleSimulatePayment}
                    disabled={isSimulating}
                    className="w-full mt-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
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
                  className="w-full border border-slate-800 text-slate-400 hover:text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all"
                >
                  Batal / Kembali
                </button>
              </div>
            )}
          </div>

          {/* Pricing Info Card */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-4">Informasi Biaya</h3>
              <ul className="space-y-3.5 text-xs text-slate-400">
                <li className="flex justify-between items-center py-2 border-b border-slate-850/60">
                  <span>Generate Landing Page AI</span>
                  <span className="font-semibold text-emerald-400">Gratis (Draft)</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-slate-850/60">
                  <span>Publikasi Website</span>
                  <span className="font-semibold text-white">Rp 10.000 / Halaman</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-slate-850/60">
                  <span>Hosting Website</span>
                  <span className="font-semibold text-emerald-400">Selamanya Gratis</span>
                </li>
                <li className="flex justify-between items-center py-2">
                  <span>SSL & Custom Domain</span>
                  <span className="font-semibold text-white">Segera Hadir</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
