'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  AlertCircle,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  X,
  Search,
  Download,
  Maximize2,
  Smartphone,
  Info
} from 'lucide-react';

export default function PaymentHistoryPage() {
  const { user, session, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();

  // Data states
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'topup' | 'deployment'
  const [dateFilter, setDateFilter] = useState('today'); // 'today' | 'week' | 'month' | 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateValidationError, setDateValidationError] = useState('');

  // Modal / Detail states
  const [selectedTx, setSelectedTx] = useState(null);
  const [isQrisZoomed, setIsQrisZoomed] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch transaction history
  const fetchHistory = async (filter = dateFilter, start = startDate, end = endDate) => {
    if (!session) return;

    // Construct parameters
    let apiStart = '';
    let apiEnd = '';
    const now = new Date();

    if (filter === 'today') {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      apiStart = todayStart.toISOString();
    } else if (filter === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      apiStart = oneWeekAgo.toISOString();
    } else if (filter === 'month') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      apiStart = oneMonthAgo.toISOString();
    } else if (filter === 'custom' && start && end && !dateValidationError) {
      const startD = new Date(start);
      startD.setHours(0, 0, 0, 0);
      apiStart = startD.toISOString();
      const endD = new Date(end);
      endD.setHours(23, 59, 59, 999);
      apiEnd = endD.toISOString();
    } else if (filter === 'custom') {
      // Don't fetch yet if custom ranges are incomplete or invalid
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      let url = `${process.env.NEXT_PUBLIC_API_URL}/payments/history`;
      const params = new URLSearchParams();
      if (apiStart) params.append('startDate', apiStart);
      if (apiEnd) params.append('endDate', apiEnd);

      const queryString = params.toString();
      if (queryString) {
        url = `${url}?${queryString}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setTransactions(result.data);
        } else {
          setError('Gagal memuat data riwayat transaksi.');
        }
      } else {
        setError('Gagal terhubung ke server.');
      }
    } catch (err) {
      console.error('Failed to fetch transaction history:', err);
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(dateFilter, startDate, endDate);
  }, [session, dateFilter, startDate, endDate, dateValidationError]);

  // Date Range Validation (max 1 month / 30 days)
  useEffect(() => {
    if (dateFilter === 'custom' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end < start) {
        setDateValidationError('Tanggal akhir tidak boleh lebih awal dari tanggal mulai.');
        return;
      }

      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 30) {
        setDateValidationError('Rentang tanggal maksimal adalah 30 hari.');
      } else {
        setDateValidationError('');
      }
    } else {
      setDateValidationError('');
    }
  }, [startDate, endDate, dateFilter]);

  // Cancel pending transaction in history detail
  const handleCancelPayment = async (txId) => {
    if (!session || !txId) return;

    const confirmCancel = window.confirm('Apakah Anda yakin ingin membatalkan tagihan pembayaran ini?');
    if (!confirmCancel) return;

    setIsCancelling(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${txId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        // Refresh local items
        await fetchHistory(dateFilter, startDate, endDate);
        // Update selected item in detail view
        setSelectedTx(prev => prev ? { ...prev, status: 'EXPIRED' } : null);
        await refreshProfile();
      } else {
        alert('Gagal membatalkan transaksi.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan saat membatalkan.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Helper for QRIS Download
  const downloadQris = (tx) => {
    if (!tx) return;
    const qrUrl = tx.metadata?.qr_image_url || tx.winpay?.qrUrl || '/qris.png';
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `QRIS-${tx.order_id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Main Filter Logic
  const getFilteredTransactions = () => {
    let list = [...transactions];

    // 1. Search Query (order_id, description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (tx) =>
          tx.order_id?.toLowerCase().includes(q) ||
          tx.description?.toLowerCase().includes(q)
      );
    }

    // 2. Tab Filter (Semua, Top Up, Publikasi)
    if (activeTab === 'topup') {
      list = list.filter((tx) => tx.type === 'topup');
    } else if (activeTab === 'deployment') {
      list = list.filter((tx) => tx.type === 'deployment');
    }

    return list;
  };

  const filteredList = getFilteredTransactions();

  if (loading || (!user && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="h-12 w-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg flex flex-col transition-theme">
      <Sidebar />

      <main className="flex-grow p-4 flex flex-col min-h-screen pt-20 pb-28 max-w-md mx-auto w-full bg-theme-surface border-x border-theme-border relative transition-theme">
        
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-theme-text tracking-tight flex items-center gap-2" style={{ fontFamily: "'Sora', sans-serif" }}>
              <History className="h-6 w-6 text-theme-accent" />
              <span>Riwayat Transaksi</span>
            </h1>
            <p className="text-theme-text-sec text-xs mt-1">Pantau seluruh catatan top up saldo dan publikasi halaman Anda</p>
          </div>
          <button
            onClick={fetchHistory}
            className="p-2 rounded-xl border border-theme-border bg-theme-card/30 hover:bg-theme-card/70 transition-colors"
            title="Muat ulang data"
          >
            <RefreshCw className={`h-4 w-4 text-theme-text-sec ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-theme-card/40 border border-theme-border p-1 rounded-2xl mb-4 gap-1">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'topup', label: 'Top Up' },
            { id: 'deployment', label: 'Publikasi' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-theme-accent text-theme-accent-text shadow-sm'
                  : 'text-theme-text-sec hover:text-theme-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters Panel */}
        <div className="bg-theme-card/20 border border-theme-border/60 rounded-2xl p-4 mb-5 space-y-3.5">
          {/* Search bar */}
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-theme-text-muted" />
            <input
              type="text"
              placeholder="Cari ID pesanan, deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text placeholder-theme-text-muted focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 p-0.5 rounded-full hover:bg-theme-card/60 text-theme-text-sec"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Date presets grid */}
          <div>
            <span className="block text-[10px] font-bold text-theme-text-sec uppercase tracking-wider mb-2">Rentang Waktu</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'today', label: 'Hari Ini' },
                { id: 'week', label: '7 Hari' },
                { id: 'month', label: '30 Hari' },
              ].map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setDateFilter(preset.id);
                  }}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all ${
                    dateFilter === preset.id
                      ? 'bg-theme-card border-theme-accent text-theme-accent'
                      : 'bg-theme-bg/40 border-theme-border text-theme-text-sec hover:border-theme-text-muted'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trigger to toggle custom date fields */}
          <div className="pt-1">
            <button
              onClick={() => setDateFilter(dateFilter === 'custom' ? 'today' : 'custom')}
              className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                dateFilter === 'custom' ? 'text-theme-accent' : 'text-theme-text-sec hover:text-theme-text'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Filter Tanggal Kustom {dateFilter === 'custom' ? '▲' : '▼'}</span>
            </button>
          </div>

          {/* Custom Datepicker inputs */}
          {dateFilter === 'custom' && (
            <div className="space-y-3 pt-1 border-t border-theme-border/30 animate-fadeIn">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1">Mulai</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1">Sampai</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-xl text-xs text-theme-text focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {dateValidationError ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] rounded-lg p-2.5 flex gap-2 items-center animate-fadeIn">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{dateValidationError}</span>
                </div>
              ) : (
                <div className="bg-theme-card/30 border border-theme-border/40 text-theme-text-sec text-[9px] rounded-lg p-2 flex gap-1.5 items-center">
                  <Info className="h-3 w-3 text-theme-accent flex-shrink-0" />
                  <span>Rentang maksimal tanggal awal ke tanggal akhir adalah 30 hari.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading / Error States */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-theme-accent" />
            <span className="text-xs text-theme-text-muted">Memuat catatan transaksi...</span>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-4 flex gap-2.5 items-start mb-6">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Terjadi Masalah</span>
              <span className="mt-0.5 block">{error}</span>
            </div>
          </div>
        ) : filteredList.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-theme-card/10 border border-theme-border/60 rounded-2xl p-6">
            <History className="h-10 w-10 text-theme-text-muted mx-auto mb-3" />
            <h3 className="text-sm font-bold text-theme-text" style={{ fontFamily: "'Sora', sans-serif" }}>Tidak ada riwayat ditemukan</h3>
            <p className="text-xs text-theme-text-muted mt-1 max-w-[250px] mx-auto">
              {searchQuery || dateFilter !== 'all'
                ? 'Coba ganti kata kunci pencarian atau bersihkan filter tanggal Anda.'
                : 'Anda belum memiliki transaksi di aplikasi ini.'}
            </p>
          </div>
        ) : (
          /* Transaction List */
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold text-theme-text-muted px-1.5">
              <span>TRANSAKSI ({filteredList.length})</span>
              <span>NOMINAL / KREDIT</span>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
              {filteredList.map((tx) => {
                const isTopup = tx.type === 'topup';
                const isRefund = tx.type === 'refund';
                const channelName = tx.metadata?.channel || (isTopup ? 'Top Up' : isRefund ? 'Refund' : 'Publikasi');
                const cashVal = tx.metadata?.cash_amount;
                const isManual = tx.metadata?.mode === 'image';

                // Status styling
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

                // Date Formatting
                const txDate = new Date(tx.created_at);
                const formattedDate = txDate.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });
                const formattedTime = txDate.toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="bg-theme-card/30 border border-theme-border/60 hover:border-theme-accent/50 rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Icon Indicator */}
                      <div className={`h-9 w-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                        isTopup 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : isRefund 
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            : 'bg-theme-accent/10 border-theme-accent/20 text-theme-accent'
                      }`}>
                        {isTopup ? <ArrowDownLeft className="h-4.5 w-4.5" /> : isRefund ? <ArrowUpRight className="h-4.5 w-4.5" /> : <ArrowUpRight className="h-4.5 w-4.5" />}
                      </div>

                      {/* Text info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-theme-text truncate max-w-[150px]">
                            {isManual ? 'QRIS (Manual)' : channelName}
                          </span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border ${statusColor}`}>
                            {tx.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-theme-text-muted mt-0.5 block truncate max-w-[170px]">
                          {tx.description || `Transaksi ${tx.type}`}
                        </span>
                        <span className="text-[9px] text-theme-text-sec mt-1 block">
                          {formattedDate} • {formattedTime}
                        </span>
                      </div>
                    </div>

                    {/* Amount & Arrow Right */}
                    <div className="flex items-center gap-2 flex-shrink-0 text-right">
                      <div>
                        <span className={`text-xs font-black block ${
                          isTopup || isRefund ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {isTopup || isRefund ? `+${tx.amount.toLocaleString('id-ID')}` : `-${Math.abs(tx.amount).toLocaleString('id-ID')}`} Credit
                        </span>
                        {cashVal && (
                          <span className="text-[9px] text-theme-text-sec font-medium mt-0.5 block">
                            Rp {cashVal.toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-theme-text-muted" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Transaction Details Modal/Overlay */}
      {selectedTx && (
        <div 
          onClick={() => setSelectedTx(null)}
          className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-300 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-theme-surface border border-theme-border rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-2xl relative text-theme-text p-6 flex flex-col gap-5 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-250 max-h-[85vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-theme-border/40 pb-4">
              <div>
                <h3 className="text-base font-black tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Detail Transaksi
                </h3>
                <p className="text-[9px] font-mono text-theme-text-muted mt-1">
                  ID: {selectedTx.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1.5 rounded-full hover:bg-theme-card/60 text-theme-text-sec transition-colors"
                title="Tutup"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Status Summary Banner */}
            <div className="flex items-center gap-3.5 bg-theme-card/30 border border-theme-border/50 rounded-2xl p-4">
              {(() => {
                if (selectedTx.status === 'PAID' || selectedTx.status === 'SUCCESS') {
                  return (
                    <>
                      <CheckCircle className="h-8 w-8 text-emerald-400 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-theme-text block">Transaksi Berhasil</span>
                        <span className="text-[10px] text-theme-text-sec mt-0.5 block">Pembayaran Anda telah sukses diverifikasi dan saldo/layanan telah terupdate.</span>
                      </div>
                    </>
                  );
                } else if (selectedTx.status === 'PENDING') {
                  return (
                    <>
                      <Clock className="h-8 w-8 text-amber-400 flex-shrink-0 animate-pulse" />
                      <div>
                        <span className="text-xs font-bold text-theme-text block">Menunggu Pembayaran</span>
                        <span className="text-[10px] text-theme-text-sec mt-0.5 block">Harap selesaikan pembayaran Anda sebelum batas waktu kedaluwarsa.</span>
                      </div>
                    </>
                  );
                } else if (selectedTx.status === 'EXPIRED') {
                  return (
                    <>
                      <XCircle className="h-8 w-8 text-theme-text-muted flex-shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-theme-text block">Transaksi Kedaluwarsa</span>
                        <span className="text-[10px] text-theme-text-sec mt-0.5 block">Batas waktu pembayaran telah habis. Silakan buat transaksi baru.</span>
                      </div>
                    </>
                  );
                } else {
                  return (
                    <>
                      <XCircle className="h-8 w-8 text-red-400 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-theme-text block">Transaksi Gagal</span>
                        <span className="text-[10px] text-theme-text-sec mt-0.5 block">Terjadi gangguan dalam memproses transaksi ini.</span>
                      </div>
                    </>
                  );
                }
              })()}
            </div>

            {/* Core Details Grid */}
            <div className="bg-theme-bg border border-theme-border rounded-2xl p-4 space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-theme-text-sec font-semibold">Tipe Transaksi</span>
                <span className="font-bold text-theme-text capitalize">{selectedTx.type === 'topup' ? 'Top Up Kredit' : selectedTx.type === 'deployment' ? 'Publikasi Halaman' : selectedTx.type}</span>
              </div>

              <div className="flex justify-between items-center text-xs border-t border-theme-border/40 pt-3">
                <span className="text-theme-text-sec font-semibold">Nomor Invoice</span>
                <span className="font-mono font-bold text-theme-text select-all">{selectedTx.order_id || '-'}</span>
              </div>

              <div className="flex justify-between items-center text-xs border-t border-theme-border/40 pt-3">
                <span className="text-theme-text-sec font-semibold">Waktu</span>
                <span className="font-medium text-theme-text">
                  {new Date(selectedTx.created_at).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {selectedTx.metadata?.expired_at && selectedTx.status === 'PENDING' && (
                <div className="flex justify-between items-center text-xs border-t border-theme-border/40 pt-3">
                  <span className="text-theme-text-sec font-semibold">Kedaluwarsa Pada</span>
                  <span className="font-bold text-red-400">
                    {new Date(selectedTx.metadata.expired_at).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-start text-xs border-t border-theme-border/40 pt-3">
                <span className="text-theme-text-sec font-semibold mt-0.5">Deskripsi</span>
                <span className="font-medium text-theme-text max-w-[200px] text-right">{selectedTx.description || '-'}</span>
              </div>

              <div className="flex justify-between items-center text-xs border-t border-theme-border/40 pt-3">
                <span className="text-theme-text-sec font-semibold">Nilai Transaksi</span>
                <span className={`font-black ${selectedTx.type === 'topup' || selectedTx.type === 'refund' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {selectedTx.type === 'topup' || selectedTx.type === 'refund' ? `+${selectedTx.amount.toLocaleString('id-ID')}` : `-${Math.abs(selectedTx.amount).toLocaleString('id-ID')}`} Credit
                </span>
              </div>

              {selectedTx.metadata?.cash_amount && (
                <div className="flex justify-between items-center text-xs border-t border-theme-border/40 pt-3">
                  <span className="text-theme-text-sec font-semibold">Jumlah Rupiah</span>
                  <span className="font-bold text-theme-text">Rp {selectedTx.metadata.cash_amount.toLocaleString('id-ID')}</span>
                </div>
              )}

              {selectedTx.va_number && selectedTx.va_number !== selectedTx.order_id && (
                <div className="flex justify-between items-center text-xs border-t border-theme-border/40 pt-3">
                  <span className="text-theme-text-sec font-semibold">Nomor Virtual Account</span>
                  <span className="font-mono font-bold text-theme-accent select-all">{selectedTx.va_number}</span>
                </div>
              )}
            </div>

            {/* Pending payment instructions (if applicable) */}
            {selectedTx.status === 'PENDING' && selectedTx.type === 'topup' && (
              <div className="border border-theme-border/60 bg-theme-accent/5 rounded-2xl p-4.5 space-y-4">
                <span className="block text-[10px] font-bold text-theme-accent uppercase tracking-wider">Instruksi Pembayaran</span>
                
                {selectedTx.metadata?.channel === 'QRIS' ? (
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-[9px] text-theme-text-muted uppercase tracking-wider font-bold">Scan Kode QRIS</span>
                    <div 
                      onClick={() => setIsQrisZoomed(true)}
                      className="bg-white p-2 rounded-xl border border-theme-border flex items-center justify-center cursor-zoom-in hover:scale-[1.02] active:scale-95 transition-all shadow group relative overflow-hidden"
                    >
                      <img 
                        src={selectedTx.metadata?.qr_image_url || selectedTx.winpay?.qrUrl || '/qris.png'} 
                        alt="QRIS Code" 
                        className="w-40 h-40 object-contain"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-bold gap-1 rounded-xl">
                        <Maximize2 className="h-3 w-3" />
                        <span>Perbesar</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadQris(selectedTx)}
                      className="text-[9px] font-bold text-theme-accent hover:underline flex items-center gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Unduh Gambar QRIS</span>
                    </button>

                    {/* Confirm WA button */}
                    {selectedTx.metadata?.confirm_payment_url && (
                      <a
                        href={selectedTx.metadata.confirm_payment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full mt-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 text-center"
                      >
                        <span>Verifikasi Pembayaran via WhatsApp</span>
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[10px] text-theme-text-sec">Silakan lakukan transfer ke nomor Virtual Account ({selectedTx.metadata?.channel || 'BCA'}) berikut:</p>
                    <div className="bg-theme-bg p-3.5 rounded-xl border border-theme-border flex items-center justify-between">
                      <span className="text-lg font-mono font-extrabold text-theme-accent tracking-wide select-all">
                        {selectedTx.va_number}
                      </span>
                      <span className="text-[9px] font-bold text-theme-text-muted bg-theme-card/50 border border-theme-border px-1.5 py-0.5 rounded font-mono">
                        {selectedTx.metadata?.channel || 'VA'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Cancel pending transaction */}
                <button
                  onClick={() => handleCancelPayment(selectedTx.id)}
                  disabled={isCancelling}
                  className="w-full border border-theme-border hover:bg-red-500/10 hover:text-red-400 text-theme-text-sec font-semibold text-xs py-2 px-4 rounded-xl transition-all disabled:opacity-50 mt-1"
                >
                  {isCancelling ? 'Membatalkan...' : 'Batalkan Tagihan ini'}
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div className="w-full mt-1">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="w-full py-3 px-4 bg-theme-card border border-theme-border/60 hover:border-theme-text-muted text-theme-text rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-[0.98]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QRIS Zoom Modal Overlay in details */}
      {isQrisZoomed && selectedTx && (
        <div 
          onClick={() => setIsQrisZoomed(false)}
          className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md transition-all duration-300 cursor-zoom-out animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-5 rounded-3xl w-full max-w-[400px] shadow-2xl relative text-slate-900 flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Close button */}
            <button
              onClick={() => setIsQrisZoomed(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="text-center mt-2">
              <h3 className="text-base font-black tracking-tight text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                Scan Kode QRIS
              </h3>
              <p className="text-[10px] font-mono text-slate-500 mt-1">
                Order ID: {selectedTx.order_id}
              </p>
            </div>

            {/* QRIS Large Image */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 flex items-center justify-center shadow-inner">
              <img 
                src={selectedTx.metadata?.qr_image_url || selectedTx.winpay?.qrUrl || '/qris.png'} 
                alt="QRIS Code Large" 
                className="w-[350px] h-[350px] object-contain"
              />
            </div>

            <div className="w-full mt-1">
              <button
                type="button"
                onClick={() => setIsQrisZoomed(false)}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200/60 cursor-pointer active:scale-[0.98]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
