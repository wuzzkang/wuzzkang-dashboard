'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useModalHistory } from '@/hooks/useModalHistory';
import PageLayout from '@/components/PageLayout';
import Skeleton from '@/components/Skeleton';
import ConfirmDialog from '@/components/ConfirmDialog';
import AlertBanner from '@/components/AlertBanner';
import QrisZoomModal from '@/components/QrisZoomModal';
import TransactionStatusBadge from '@/components/TransactionStatusBadge';
import { CreditCard, ArrowRight, CheckCircle, RefreshCw, Smartphone, Clock, Maximize2, Download, X } from 'lucide-react';
import { BRAND_NAME } from '@/config/branding';

export default function TopUpPage() {
  const { user, session, profile, loading, refreshProfile } = useRequireAuth();
  const router = useRouter();

  // Input states (Credits)
  const [amount, setAmount] = useState(500);
  const [channel, setChannel] = useState('BCA');

  // App states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isQrisZoomed, setIsQrisZoomed] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Modal / Detail close handlers to handle popstate / browser back button
  const prevActiveTxRef = useRef(null);
  const prevQrisZoomRef = useRef(false);

  // Use the shared useModalHistory hook for browser back button handling
  useModalHistory(!!activeTransaction, 'active-tx', () => setActiveTransaction(null));
  useModalHistory(isQrisZoomed, 'qris-zoom', () => setIsQrisZoomed(false));

  // Fetch active products list from backend
  useEffect(() => {
    const fetchProducts = async () => {
      if (!session) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            setProducts(result.data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, [session?.access_token]);

  // Fetch active payment methods list from backend
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!session) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-methods`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            setPaymentMethods(result.data);
            
            // Set default selected channel based on fetched methods
            const activeMethods = result.data.filter(m => m.is_active);
            if (activeMethods.length > 0) {
              const vaMethod = activeMethods.find(m => m.id === 'virtual_account');
              if (vaMethod && vaMethod.config?.channels?.length > 0) {
                setChannel(vaMethod.config.channels[0]);
              } else {
                const firstMethod = activeMethods[0];
                if (firstMethod.id === 'qris') {
                  setChannel('QRIS');
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch payment methods:', err);
      }
    };
    fetchPaymentMethods();
  }, [session?.access_token]);

  // Fetch active pending topup transaction from backend
  useEffect(() => {
    const fetchPendingTransaction = async () => {
      if (!session) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/pending`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setActiveTransaction(result.data);
            // Sync channel select state to match the pending channel
            if (result.data.metadata?.channel) {
              setChannel(result.data.metadata.channel);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch pending transaction:', err);
      }
    };
    fetchPendingTransaction();
  }, [session?.access_token]);

  // Countdown timer for pending payment expiration
  useEffect(() => {
    if (!activeTransaction || !activeTransaction.metadata?.expired_at) {
      setTimeLeft('');
      return;
    }

    const updateTimer = () => {
      const difference = new Date(activeTransaction.metadata.expired_at).getTime() - Date.now();
      if (difference <= 0) {
        setTimeLeft('Expired');
        setActiveTransaction(null);
        refreshProfile();
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const parts = [];
      if (hours > 0) parts.push(`${hours} jam`);
      if (minutes > 0) parts.push(`${minutes} menit`);
      parts.push(`${seconds} detik`);

      setTimeLeft(`Sisa waktu: ${parts.join(' ')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeTransaction, refreshProfile]);

  const fetchHistory = async () => {
    if (!session) return;
    try {
      setIsLoadingHistory(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/history`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setTransactions(result.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch transaction history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Fetch transaction history reactively
  useEffect(() => {
    fetchHistory();
  }, [session?.access_token, activeTransaction]);

  // Helper to determine payment options based on dynamic database setting
  const getActivePaymentChannels = () => {
    if (paymentMethods.length === 0) {
      // Fallback
      return [
        { code: 'BCA', name: 'BCA Virtual Account' },
        { code: 'MANDIRI', name: 'Mandiri Virtual Account' },
        { code: 'BNI', name: 'BNI Virtual Account' },
        { code: 'BRI', name: 'BRI Virtual Account' },
      ];
    }

    const channels = [];
    
    // Process Virtual Account
    const vaMethod = paymentMethods.find(m => m.id === 'virtual_account' && m.is_active);
    if (vaMethod) {
      const vaChannels = vaMethod.config?.channels || ['BCA', 'MANDIRI', 'BNI', 'BRI'];
      vaChannels.forEach(ch => {
        channels.push({
          code: ch,
          name: `${ch} Virtual Account`
        });
      });
    }

    // Process QRIS
    const qrisMethod = paymentMethods.find(m => m.id === 'qris' && m.is_active);
    if (qrisMethod) {
      channels.push({
        code: 'QRIS',
        name: 'QRIS (Gopay, OVO, ShopeePay, LinkAja)'
      });
    }

    return channels;
  };



  const presetAmounts = [100, 250, 500, 1000];

  // Filter today's top-up transactions only
  const todayTopups = transactions.filter((tx) => {
    const isTopup = tx.type === 'topup';
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const isToday = new Date(tx.created_at).getTime() >= todayStart.getTime();
    return isTopup && isToday;
  });
  const paymentChannels = [
    { code: 'BCA', name: 'BCA Virtual Account' },
    { code: 'MANDIRI', name: 'Mandiri Virtual Account' },
    { code: 'BNI', name: 'BNI Virtual Account' },
    { code: 'BRI', name: 'BRI Virtual Account' },
  ];

  const downloadQris = () => {
    if (!activeTransaction) return;
    const qrUrl = activeTransaction.metadata?.qr_image_url || activeTransaction.winpay?.qrUrl || '/qris.png';
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `QRIS-${activeTransaction.order_id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    const creditPrice = profile?.credit_price_idr ?? 100;
    const minCredits = Math.ceil(10000 / creditPrice);

    if (!amount || amount < minCredits) {
      setError(`Minimal top up adalah ${minCredits} Credit (Rp 10.000)`);
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

  const handleCancelPayment = async () => {
    if (!activeTransaction) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${activeTransaction.id}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        setActiveTransaction(null);
      } else {
        const result = await response.json();
        setError(result.error || 'Gagal membatalkan tagihan pembayaran.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan saat membatalkan.');
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
        setSuccessMessage(`Berhasil simulasi pembayaran! ${activeTransaction.amount.toLocaleString('id-ID')} Credit telah ditambahkan.`);
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
    <>
      <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-theme-text tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>Top Up Credit</h1>
        <p className="text-theme-text-sec text-xs mt-1">Tambah credit {BRAND_NAME} untuk mendeploy website landing page Anda</p>
      </div>

        <div className="space-y-6">
          {/* Form Top Up */}
          <div className="space-y-4">
            <AlertBanner type="error" message={error} />
            <AlertBanner type="success" message={successMessage} />

            {!activeTransaction ? (
              <div className="bg-theme-card/40 border border-theme-border rounded-2xl p-5">
                <form onSubmit={handleCreatePayment} className="space-y-5">
                  {/* Amount Selection */}
                  <div>
                    <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2.5">
                      Pilih Nominal Top Up
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
                          {amt.toLocaleString('id-ID')} Credit
                        </button>
                      ))}
                    </div>

                    {(() => {
                      const creditPrice = profile?.credit_price_idr ?? 100;
                      const minCredits = Math.ceil(10000 / creditPrice);
                      return (
                        <>
                          <div className="relative flex items-center mb-3">
                            <input
                              type="number"
                              required
                              min={minCredits}
                              placeholder="Masukkan jumlah credit..."
                              value={amount || ''}
                              onChange={(e) => setAmount(Number(e.target.value))}
                              disabled={isSubmitting}
                              className="block w-full pl-3.5 pr-14 py-2.5 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none transition-colors"
                            />
                            <span className="absolute right-3.5 text-theme-text-muted text-[10px] font-bold uppercase">Credit</span>
                          </div>

                          {/* Dynamic conversion preview */}
                          <div className="mt-3 space-y-2">
                            <div className="text-[10px] text-theme-text-sec font-semibold flex justify-between items-center bg-theme-bg/30 border border-theme-border/50 p-2.5 rounded-lg">
                              <span>Rate Konversi:</span>
                              <span className="text-theme-accent">1 Credit = Rp {creditPrice.toLocaleString('id-ID')}</span>
                            </div>
                            {amount >= minCredits && (
                              <div className="text-xs font-bold text-emerald-400 flex justify-between items-center pt-1 animate-fadeIn">
                                <span>Total Biaya:</span>
                                <span>Rp {(amount * creditPrice).toLocaleString('id-ID')}</span>
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Channel Selection */}
                  <div>
                    <label className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2.5">
                      Pilih Metode Pembayaran
                    </label>
                    <div className="space-y-2">
                      {getActivePaymentChannels().map((ch) => (
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
              /* Menampilkan VA Number / QRIS Code */
              <div className="bg-theme-card/40 border border-theme-border rounded-2xl p-5 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-theme-text mb-0.5" style={{ fontFamily: "'Sora', sans-serif" }}>Menunggu Pembayaran</h3>
                  <p className="text-[10px] text-theme-text-sec">
                    {channel === 'QRIS' 
                      ? 'Silakan scan kode QRIS di bawah ini untuk membayar' 
                      : 'Silakan lakukan transfer ke nomor Virtual Account di bawah'}
                  </p>
                </div>

                <div className="bg-theme-bg border border-theme-border rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-theme-text-sec">
                    <span>Order ID:</span>
                    <span className="font-mono text-theme-text">{activeTransaction.order_id}</span>
                  </div>
                  
                  {timeLeft && (
                    <div className="flex justify-between items-center text-[10px] font-semibold text-theme-text-sec border-t border-theme-border/40 pt-2">
                      <span>Batas Pembayaran:</span>
                      <span className="text-red-400 font-bold flex items-center gap-1.5">
                        <Clock className="h-3 w-3 animate-pulse" />
                        <span>{timeLeft}</span>
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-[10px] font-semibold text-theme-text-sec">
                    <span>Nominal Pembayaran:</span>
                    <span className="text-theme-text text-sm font-bold">
                      Rp {(activeTransaction.metadata?.cash_amount ?? (activeTransaction.amount * (profile?.credit_price_idr ?? 100))).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-semibold text-theme-text-sec border-t border-theme-border/40 pt-2">
                    <span>Credit yang didapat:</span>
                    <span className="text-emerald-400 text-xs font-bold">
                      {activeTransaction.amount.toLocaleString('id-ID')} Credit
                    </span>
                  </div>

                  {channel === 'QRIS' ? (
                    <div className="border-t border-theme-border pt-3.5 flex flex-col items-center gap-3.5">
                      <span className="text-[9px] text-theme-text-muted uppercase tracking-wider font-bold">Scan Kode QRIS</span>
                      <div 
                        onClick={() => setIsQrisZoomed(true)}
                        className="bg-white p-2.5 rounded-2xl border border-theme-border flex items-center justify-center cursor-zoom-in hover:scale-[1.02] active:scale-95 transition-all shadow-md group relative overflow-hidden"
                      >
                        <img 
                          src={activeTransaction.metadata?.qr_image_url || activeTransaction.winpay?.qrUrl || '/qris.png'} 
                          alt="QRIS Code" 
                          className="w-56 h-56 object-contain"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1 rounded-2xl">
                          <Maximize2 className="h-3.5 w-3.5" />
                          <span>Klik untuk Perbesar</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={downloadQris}
                        className="text-[10px] font-bold text-theme-accent hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Unduh Gambar QRIS</span>
                      </button>
                    </div>
                  ) : (
                    <div className="border-t border-theme-border pt-3.5 flex flex-col gap-1">
                      <span className="text-[9px] text-theme-text-muted uppercase tracking-wider font-bold">Nomor Virtual Account ({channel})</span>
                      <span className="text-xl font-mono font-extrabold text-theme-accent tracking-wide select-all">
                        {(activeTransaction.va_number || '').trim() || '88301234567890'}
                      </span>
                    </div>
                  )}
                </div>

                {/* WhatsApp Payment Verification Button for Manual QRIS Image Mode */}
                {channel === 'QRIS' && activeTransaction.metadata?.confirm_payment_url && (
                  <a
                    href={activeTransaction.metadata.confirm_payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-center"
                  >
                    <span>Verifikasi Pembayaran via WhatsApp</span>
                  </a>
                )}

                {/* Local Dev Simulator Helper */}
                {(process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENABLE_PAYMENT_SIMULATOR === 'true') && (
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
                )}

                <button
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={isSubmitting}
                  className="w-full border border-theme-border text-theme-text-sec hover:text-theme-text font-semibold text-xs py-2.5 px-4 rounded-xl transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Membatalkan...' : 'Batal / Kembali'}
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
              {products && products.length > 0 ? (
                products.map((prod) => (
                  <li key={prod.id} className="flex justify-between items-center py-1.5 border-b border-theme-border animate-fadeIn">
                    <span>Publikasi ({prod.name})</span>
                    <span className="font-semibold text-theme-text">
                      {prod.is_active ? `${prod.cost.toLocaleString('id-ID')} Credit / ${prod.unit || 'Halaman'}` : 'Dinonaktifkan'}
                    </span>
                  </li>
                ))
              ) : (
                <li className="flex justify-between items-center py-1.5 border-b border-theme-border">
                  <span>Publikasi Website</span>
                  <span className="font-semibold text-theme-text">100 Credit / Halaman</span>
                </li>
              )}
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

          {/* Riwayat Transaksi Card */}
          <div className="bg-theme-card/40 border border-theme-border rounded-2xl p-5 animate-fadeIn">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-theme-text" style={{ fontFamily: "'Sora', sans-serif" }}>Riwayat Top Up Hari Ini</h3>
              <button
                onClick={() => router.push('/payments/history')}
                className="text-[10px] font-bold text-theme-accent hover:underline"
              >
                Lihat Semua
              </button>
            </div>
            {loading || isLoadingHistory ? (
              <Skeleton type="list" count={2} />
            ) : todayTopups.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-theme-text-muted">Belum ada riwayat top up hari ini</p>
                <button
                  onClick={() => router.push('/payments/history')}
                  className="mt-3 text-[10px] font-bold text-theme-accent hover:underline bg-theme-accent/10 py-1.5 px-3 rounded-lg border border-theme-accent/20 transition-all hover:bg-theme-accent/20"
                >
                  Lihat Seluruh Riwayat Transaksi
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                  {todayTopups.map((tx) => {
                    const isTopup = tx.type === 'topup';
                    const isManual = tx.metadata?.mode === 'image';
                    const channelName = tx.metadata?.channel || (isTopup ? 'Top Up' : 'Deployment');
                    const cashVal = tx.metadata?.cash_amount;
                    const dateStr = new Date(tx.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    // Status details
                    let statusColor = 'text-theme-text-sec bg-theme-bg border-theme-border';
                    if (tx.status === 'PAID' || tx.status === 'SUCCESS') {
                      statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                    } else if (tx.status === 'PENDING') {
                      statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                    } else if (tx.status === 'EXPIRED') {
                      statusColor = 'text-theme-text-muted bg-theme-bg border-theme-border';
                    } else if (tx.status === 'FAILED') {
                      statusColor = 'text-red-400 bg-red-500/10 border-red-500/20';
                    }

                    return (
                      <div key={tx.id} className="bg-theme-bg/30 border border-theme-border/60 rounded-xl p-3 space-y-2.5 transition-all hover:border-theme-border">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-theme-text">
                                {isManual ? 'QRIS (Manual)' : `${channelName}`}
                              </span>
                              {tx.va_number && tx.va_number !== tx.order_id && (
                                <span className="font-mono text-[9px] text-theme-text-sec bg-theme-bg px-1 py-0.5 rounded border border-theme-border">
                                  {tx.va_number}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-theme-text-muted block mt-0.5">{dateStr}</span>
                          </div>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${statusColor}`}>
                            {tx.status}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-xs pt-1 border-t border-theme-border/30">
                          <span className="text-theme-text-sec font-medium">
                            {cashVal ? `Rp ${cashVal.toLocaleString('id-ID')}` : '-'}
                          </span>
                          <span className="font-black text-emerald-400">
                           +{tx.amount.toLocaleString('id-ID')} Credit
                          </span>
                        </div>

                        {/* Interactive Actions for PENDING status */}
                        {tx.status === 'PENDING' && isTopup && (
                          <div className="pt-2 border-t border-theme-border/20 flex gap-2">
                            {isManual ? (
                              tx.metadata?.confirm_payment_url && (
                                <a
                                  href={tx.metadata.confirm_payment_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full text-center bg-emerald-600/20 hover:bg-emerald-600/35 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] py-1.5 px-3 rounded-lg transition-all"
                                >
                                  Lanjut Konfirmasi WA
                                </a>
                              )
                            ) : (
                              <button
                                onClick={() => {
                                  setActiveTransaction(tx);
                                  setChannel(tx.metadata?.channel || 'BCA');
                                }}
                                className="w-full text-center bg-theme-accent/20 hover:bg-theme-accent/35 border border-theme-accent/30 text-theme-accent font-bold text-[10px] py-1.5 px-3 rounded-lg transition-all"
                              >
                                Lihat Cara Bayar (VA)
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-theme-border/20">
                  <button
                    onClick={() => router.push('/payments/history')}
                    className="w-full text-center py-2.5 px-3 bg-theme-card border border-theme-border hover:border-theme-text-muted text-theme-text rounded-xl text-[10px] font-bold transition-all"
                  >
                    Lihat Seluruh Riwayat Transaksi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* QRIS Zoom Modal Overlay */}

        <ConfirmDialog
          isOpen={showCancelConfirm}
          title="Batalkan Tagihan"
          message="Apakah Anda yakin ingin membatalkan tagihan pembayaran ini? Tindakan ini tidak dapat dibatalkan."
          confirmLabel="Ya, Batalkan"
          cancelLabel="Kembali"
          onConfirm={() => {
            handleCancelPayment();
            setShowCancelConfirm(false);
          }}
          onCancel={() => setShowCancelConfirm(false)}
          variant="warning"
        />
      </PageLayout>

      {/* QRIS Zoom Modal */}
      <QrisZoomModal
        isOpen={isQrisZoomed && !!activeTransaction}
        onClose={() => setIsQrisZoomed(false)}
        transaction={activeTransaction}
      />
    </>
  );
}
