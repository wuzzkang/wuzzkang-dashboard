'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRequireAdmin } from '@/hooks/useRequireAdmin';
import { 
  fetchAdminStats, 
  fetchAdminTransactions, 
  fetchAdminUsers, 
  completeTransaction,
  toggleUserStatus,
  deleteUserAccount
} from '@/lib/adminApi';
import PageLayout from '@/components/PageLayout';
import Loading from '@/components/Loading';
import Skeleton from '@/components/Skeleton';
import AlertBanner from '@/components/AlertBanner';
import ConfirmDialog from '@/components/ConfirmDialog';
import TransactionStatusBadge from '@/components/TransactionStatusBadge';
import {
  Shield, Users, Receipt, Banknote, Clock,
  Search, X, RefreshCw, ChevronLeft, ChevronRight,
  CheckCircle, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, session, profile, loading } = useRequireAdmin();

  // Navigation tab
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' | 'users'

  // Data states
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
    totalRevenueIdr: 0,
    totalCreditsIssued: 0,
  });
  
  // Transactions states
  const [transactions, setTransactions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isTxLoading, setIsTxLoading] = useState(true);
  
  // Users states
  const [users, setUsers] = useState([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [isUsersLoading, setIsUsersLoading] = useState(true);

  // Loading & Error states
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypeTab, setActiveTypeTab] = useState('all'); // 'all' | 'topup' | 'deployment'
  const [activeStatusTab, setActiveStatusTab] = useState('all'); // 'all' | 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED'

  // Pagination states
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);

  // Manual completion state
  const [completeTxId, setCompleteTxId] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);

  // User toggle/delete states
  const [confirmUserAction, setConfirmUserAction] = useState(null); // null | { type: 'suspend' | 'reactivate' | 'delete', user: Object }

  // Fetch stats function
  const loadStats = useCallback(async () => {
    if (!session?.access_token) return;
    try {
      setIsStatsLoading(true);
      const data = await fetchAdminStats(session.access_token);
      setStats(data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setIsStatsLoading(false);
    }
  }, [session?.access_token]);

  // Fetch transactions function
  const loadTransactions = useCallback(async () => {
    if (!session?.access_token) return;
    try {
      setIsTxLoading(true);
      setErrorMessage('');
      const typeFilter = activeTypeTab === 'all' ? '' : activeTypeTab;
      const statusFilter = activeStatusTab === 'all' ? '' : activeStatusTab;

      const result = await fetchAdminTransactions(session.access_token, {
        search: searchQuery,
        status: statusFilter,
        type: typeFilter,
        limit,
        offset,
      });

      setTransactions(result.transactions);
      setTotalCount(result.totalCount);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setErrorMessage(err.message || 'Gagal memuat transaksi.');
    } finally {
      setIsTxLoading(false);
    }
  }, [session?.access_token, searchQuery, activeTypeTab, activeStatusTab, limit, offset]);

  // Fetch users function
  const loadUsers = useCallback(async () => {
    if (!session?.access_token) return;
    try {
      setIsUsersLoading(true);
      setErrorMessage('');
      const result = await fetchAdminUsers(session.access_token, {
        search: searchQuery,
        limit,
        offset,
      });
      setUsers(result.users);
      setTotalUsersCount(result.totalCount);
    } catch (err) {
      console.error('Failed to load users:', err);
      setErrorMessage(err.message || 'Gagal memuat pengguna.');
    } finally {
      setIsUsersLoading(false);
    }
  }, [session?.access_token, searchQuery, limit, offset]);

  // Refresh helper
  const handleRefresh = async () => {
    setSuccessMessage('');
    setErrorMessage('');
    if (activeTab === 'transactions') {
      await Promise.all([loadStats(), loadTransactions()]);
    } else {
      await Promise.all([loadStats(), loadUsers()]);
    }
  };

  // Reset page parameters on tab change
  useEffect(() => {
    setSearchQuery('');
    setOffset(0);
    setSuccessMessage('');
    setErrorMessage('');
  }, [activeTab]);

  // Trigger stats loading on mount/session changes
  useEffect(() => {
    if (session?.access_token) {
      loadStats();
    }
  }, [session?.access_token, loadStats]);

  // Trigger transaction/user list loading
  useEffect(() => {
    if (session?.access_token) {
      if (activeTab === 'transactions') {
        loadTransactions();
      } else {
        loadUsers();
      }
    }
  }, [session?.access_token, activeTab, loadTransactions, loadUsers]);

  // Reset offset on query change
  useEffect(() => {
    setOffset(0);
  }, [searchQuery, activeTypeTab, activeStatusTab]);

  // Handle manual complete action
  const handleComplete = async () => {
    if (!session?.access_token || !completeTxId) return;
    try {
      setIsCompleting(true);
      setErrorMessage('');
      setSuccessMessage('');
      const res = await completeTransaction(session.access_token, completeTxId);
      if (res.success) {
        setSuccessMessage(`Transaksi ${completeTxId} berhasil diselesaikan manual.`);
        setCompleteTxId(null);
        await handleRefresh();
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Gagal memproses transaksi.');
      setCompleteTxId(null);
    } finally {
      setIsCompleting(false);
    }
  };

  // Handle User status change / delete actions
  const handleUserAction = async () => {
    if (!session?.access_token || !confirmUserAction) return;
    const { type, user: targetUser } = confirmUserAction;
    try {
      setErrorMessage('');
      setSuccessMessage('');
      
      if (type === 'delete') {
        const res = await deleteUserAccount(session.access_token, targetUser.id);
        setSuccessMessage(res.message || `Akun ${targetUser.email} berhasil dihapus permanen.`);
      } else if (type === 'suspend') {
        const res = await toggleUserStatus(session.access_token, targetUser.id, false);
        setSuccessMessage(res.message || `Akun ${targetUser.email} berhasil dinonaktifkan.`);
      } else if (type === 'reactivate') {
        const res = await toggleUserStatus(session.access_token, targetUser.id, true);
        setSuccessMessage(res.message || `Akun ${targetUser.email} berhasil diaktifkan kembali.`);
      }

      setConfirmUserAction(null);
      await handleRefresh();
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Gagal mengeksekusi aksi pada pengguna.');
      setConfirmUserAction(null);
    }
  };

  // Auth guard loading
  if (loading || !user || !profile) {
    return <Loading fullScreen text="Memverifikasi Akses Admin..." size="lg" />;
  }

  // Calculate pages based on active tab data
  const currentTotal = activeTab === 'transactions' ? totalCount : totalUsersCount;
  const totalPages = Math.ceil(currentTotal / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-theme-text tracking-tight flex items-center gap-2" style={{ fontFamily: "'Sora', sans-serif" }}>
            <Shield className="h-6 w-6 text-theme-accent" />
            <span>Admin Panel</span>
          </h1>
          <p className="text-theme-text-sec text-xs mt-1">Platform-wide overview and manual validation center</p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 rounded-xl border border-theme-border bg-theme-card/30 hover:bg-theme-card/70 transition-colors"
          title="Muat ulang data"
          disabled={isStatsLoading || isTxLoading || isUsersLoading}
        >
          <RefreshCw className={`h-4 w-4 text-theme-text-sec ${(isStatsLoading || isTxLoading || isUsersLoading) ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Alert Banners */}
      {successMessage && <AlertBanner type="success" message={successMessage} className="mb-4" />}
      {errorMessage && <AlertBanner type="error" message={errorMessage} className="mb-4" />}

      {/* Stats Cards Section */}
      {isStatsLoading ? (
        <Skeleton type="card" count={2} />
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Card 1: Users */}
          <div className="bg-theme-card/30 border border-theme-border/60 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-theme-text-sec text-[10px] font-bold uppercase tracking-wider mb-2">
              <Users className="h-3.5 w-3.5 text-theme-accent" />
              <span>Total Pengguna</span>
            </div>
            <div className="text-xl font-bold text-theme-text" style={{ fontFamily: "'Sora', sans-serif" }}>
              {stats.totalUsers.toLocaleString('id-ID')}
            </div>
          </div>

          {/* Card 2: Transactions */}
          <div className="bg-theme-card/30 border border-theme-border/60 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-theme-text-sec text-[10px] font-bold uppercase tracking-wider mb-2">
              <Receipt className="h-3.5 w-3.5 text-theme-accent" />
              <span>Total Transaksi</span>
            </div>
            <div className="text-xl font-bold text-theme-text" style={{ fontFamily: "'Sora', sans-serif" }}>
              {stats.totalTransactions.toLocaleString('id-ID')}
            </div>
          </div>

          {/* Card 3: Revenue */}
          <div className="bg-theme-card/30 border border-theme-border/60 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-theme-text-sec text-[10px] font-bold uppercase tracking-wider mb-2">
              <Banknote className="h-3.5 w-3.5 text-theme-accent" />
              <span>Pendapatan</span>
            </div>
            <div className="text-xl font-bold text-theme-text" style={{ fontFamily: "'Sora', sans-serif" }}>
              Rp {stats.totalRevenueIdr.toLocaleString('id-ID')}
            </div>
          </div>

          {/* Card 4: Pending */}
          <div className="bg-theme-card/30 border border-theme-border/60 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-theme-text-sec text-[10px] font-bold uppercase tracking-wider mb-2">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              <span>Pending VA/QRIS</span>
            </div>
            <div className="text-xl font-bold text-amber-400" style={{ fontFamily: "'Sora', sans-serif" }}>
              {stats.pendingTransactions.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      )}

      {/* Main View Tab Switcher */}
      <div className="flex bg-theme-card/30 p-1 rounded-2xl border border-theme-border/60 mb-5 gap-1">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'transactions'
              ? 'bg-theme-accent text-theme-accent-text shadow-sm'
              : 'text-theme-text-sec hover:text-theme-text'
          }`}
        >
          <Receipt className="h-4 w-4" />
          <span>Daftar Transaksi</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'users'
              ? 'bg-theme-accent text-theme-accent-text shadow-sm'
              : 'text-theme-text-sec hover:text-theme-text'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Daftar Pengguna</span>
        </button>
      </div>

      {/* Filter Panel */}
      <div className="bg-theme-card/20 border border-theme-border/60 rounded-2xl p-4 mb-5 space-y-3">
        {/* Search */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-theme-text-muted" />
          <input
            type="text"
            placeholder={activeTab === 'transactions' ? "Cari ID pesanan, UUID, deskripsi..." : "Cari nama atau email pengguna..."}
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

        {/* Transaction-Only Filters */}
        {activeTab === 'transactions' && (
          <>
            {/* Type Tabs */}
            <div>
              <span className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">Tipe</span>
              <div className="flex bg-theme-bg/60 p-0.5 rounded-xl border border-theme-border/40 gap-0.5">
                {[
                  { id: 'all', label: 'Semua' },
                  { id: 'topup', label: 'Top Up' },
                  { id: 'deployment', label: 'Publikasi' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTypeTab(tab.id)}
                    className={`flex-1 py-1.5 px-2 text-[10px] font-bold rounded-lg transition-all ${
                      activeTypeTab === tab.id
                        ? 'bg-theme-accent text-theme-accent-text shadow-sm'
                        : 'text-theme-text-sec hover:text-theme-text'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Tabs */}
            <div>
              <span className="block text-[9px] font-bold text-theme-text-sec uppercase tracking-wider mb-1.5">Status</span>
              <div className="flex bg-theme-bg/60 p-0.5 rounded-xl border border-theme-border/40 gap-0.5 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'Semua' },
                  { id: 'PENDING', label: 'Pending' },
                  { id: 'PAID', label: 'Paid' },
                  { id: 'EXPIRED', label: 'Expired' },
                  { id: 'FAILED', label: 'Failed' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveStatusTab(tab.id)}
                    className={`flex-1 min-w-[50px] py-1.5 px-2 text-[10px] font-bold rounded-lg transition-all ${
                      activeStatusTab === tab.id
                        ? 'bg-theme-accent text-theme-accent-text shadow-sm'
                        : 'text-theme-text-sec hover:text-theme-text'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Content Rendering based on Tab */}
      {activeTab === 'transactions' ? (
        // ─── TRANSACTIONS TAB ───────────────────────────────────────────────
        isTxLoading ? (
          <Skeleton type="list" count={4} />
        ) : transactions.length === 0 ? (
          <div className="text-center py-16 bg-theme-card/10 border border-theme-border/60 rounded-2xl p-6">
            <Receipt className="h-10 w-10 text-theme-text-muted mx-auto mb-3" />
            <h3 className="text-xs font-bold text-theme-text" style={{ fontFamily: "'Sora', sans-serif" }}>Tidak ada transaksi</h3>
            <p className="text-[10px] text-theme-text-muted mt-1 max-w-[250px] mx-auto">
              Tidak ada transaksi ditemukan yang cocok dengan kriteria filter Anda.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[9px] font-bold text-theme-text-muted px-1">
              <span>DAFTAR TRANSAKSI ({totalCount})</span>
              <span>NOMINAL</span>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
              {transactions.map((tx) => {
                const isTopup = tx.type === 'topup';
                const isRefund = tx.type === 'refund';
                const cashVal = tx.metadata?.cash_amount;
                const userEmail = tx.profiles?.email || 'N/A';
                const userFullName = tx.profiles?.full_name || 'Anonymous';

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
                    className="bg-theme-card/30 border border-theme-border/60 rounded-2xl p-4 flex flex-col gap-3 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Icon */}
                        <div className={`h-8 w-8 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                          isTopup 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : isRefund 
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                              : 'bg-theme-accent/10 border-theme-accent/20 text-theme-accent'
                        }`}>
                          {isTopup ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                        </div>

                        {/* Info */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-bold text-theme-text truncate max-w-[150px]">
                              {userFullName}
                            </span>
                            <TransactionStatusBadge status={tx.status} className="text-[8px]" />
                          </div>
                          <span className="text-[9px] text-theme-text-sec block truncate">
                            {userEmail}
                          </span>
                          <span className="text-[9px] font-mono text-theme-text-muted mt-0.5 block">
                            ID: {tx.order_id || tx.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right flex-shrink-0">
                        <span className={`text-[11px] font-black block ${
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
                    </div>

                    {/* Date & Action footer */}
                    <div className="flex justify-between items-center border-t border-theme-border/20 pt-2 text-[9px] text-theme-text-muted">
                      <span>
                        {formattedDate} • {formattedTime}
                      </span>
                      {tx.status === 'PENDING' && tx.type === 'topup' && (
                        <button
                          type="button"
                          onClick={() => setCompleteTxId(tx.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle className="h-3 w-3" />
                          <span>Sukseskan</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ) : (
        // ─── USERS TAB ──────────────────────────────────────────────────────
        isUsersLoading ? (
          <Skeleton type="list" count={4} />
        ) : users.length === 0 ? (
          <div className="text-center py-16 bg-theme-card/10 border border-theme-border/60 rounded-2xl p-6">
            <Users className="h-10 w-10 text-theme-text-muted mx-auto mb-3" />
            <h3 className="text-xs font-bold text-theme-text" style={{ fontFamily: "'Sora', sans-serif" }}>Tidak ada pengguna</h3>
            <p className="text-[10px] text-theme-text-muted mt-1 max-w-[250px] mx-auto">
              Tidak ada pengguna ditemukan yang cocok dengan kriteria pencarian.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[9px] font-bold text-theme-text-muted px-1">
              <span>DAFTAR PENGGUNA ({totalUsersCount})</span>
              <span>SALDO KREDIT</span>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
              {users.map((item) => {
                const displayName = item.full_name || item.email?.split('@')[0] || 'Pengguna';
                const roleLabel = item.role === 'super_admin' ? 'Super Admin' : (item.role === 'admin' ? 'Admin' : 'User');
                const lastUpdatedDate = new Date(item.updated_at || Date.now()).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });
                const isSelf = item.id === user?.id;

                return (
                  <div
                    key={item.id}
                    className="bg-theme-card/30 border border-theme-border/60 rounded-2xl p-4 flex flex-col gap-3 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar */}
                        <div className="h-9 w-9 rounded-xl bg-theme-accent/10 border border-theme-accent/20 flex items-center justify-center text-theme-accent text-sm font-bold shrink-0">
                          {item.avatar_url ? (
                            <img src={item.avatar_url} alt={displayName} className="h-full w-full object-cover rounded-xl" />
                          ) : (
                            displayName.charAt(0).toUpperCase()
                          )}
                        </div>

                        {/* User details */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-bold text-theme-text truncate max-w-[120px]">
                              {displayName}
                            </span>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${
                              item.role === 'super_admin' 
                                ? 'bg-red-500/10 border border-red-500/20 text-red-400' 
                                : item.role === 'admin'
                                  ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                                  : 'bg-theme-card border border-theme-border text-theme-text-sec'
                            }`}>
                              {roleLabel}
                            </span>
                            {item.is_active ? (
                              <span className="inline-flex items-center gap-1 text-[8px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                                <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse"></span>
                                Aktif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[8px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-full">
                                <span className="h-1 w-1 rounded-full bg-red-400"></span>
                                Nonaktif
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-theme-text-sec block truncate mt-0.5">
                            {item.email}
                          </span>
                        </div>
                      </div>

                      {/* Balance info */}
                      <div className="text-right flex-shrink-0">
                        <span className="text-[11px] font-black text-theme-accent block">
                          {(item.balance || 0).toLocaleString('id-ID')} Credit
                        </span>
                        <span className="text-[9px] text-theme-text-muted mt-0.5 block">
                          Updated: {lastUpdatedDate}
                        </span>
                      </div>
                    </div>

                    {/* Active Status & Actions Footer */}
                    <div className="flex justify-between items-center border-t border-theme-border/20 pt-2 text-[9px]">
                      <span className="text-theme-text-muted">
                        ID: {item.id}
                      </span>
                      {isSelf ? (
                        <span className="text-theme-text-muted font-bold italic">
                          (Akun Anda)
                        </span>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setConfirmUserAction({
                              type: item.is_active ? 'suspend' : 'reactivate',
                              user: item
                            })}
                            className={`px-2 py-1 font-bold rounded-lg transition-colors cursor-pointer border text-[9px] ${
                              item.is_active
                                ? 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 text-amber-400'
                                : 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {item.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmUserAction({ type: 'delete', user: item })}
                            className="px-2 py-1 bg-red-600/10 border border-red-500/20 hover:bg-red-600/20 text-red-400 font-bold rounded-lg transition-colors cursor-pointer text-[9px]"
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-theme-card/10 border border-theme-border/40 p-2.5 rounded-2xl text-[10px] font-bold mt-4">
          <button
            disabled={offset === 0}
            onClick={() => setOffset(prev => Math.max(0, prev - limit))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-theme-border bg-theme-bg text-theme-text disabled:opacity-40 transition-opacity"
          >
            <ChevronLeft className="h-3 w-3" />
            <span>Sebelumnya</span>
          </button>
          <span className="text-theme-text-sec">Halaman {currentPage} dari {totalPages}</span>
          <button
            disabled={offset + limit >= currentTotal}
            onClick={() => setOffset(prev => prev + limit)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-theme-border bg-theme-bg text-theme-text disabled:opacity-40 transition-opacity"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Manual completion Confirm Dialog */}
      <ConfirmDialog
        isOpen={completeTxId !== null}
        title="Sukseskan Transaksi"
        message="Apakah Anda yakin ingin menyelesaikan transaksi ini secara manual? Saldo user akan bertambah sesuai nominal transaksi. Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, Sukseskan"
        cancelLabel="Batal"
        onConfirm={handleComplete}
        onCancel={() => setCompleteTxId(null)}
        variant="warning"
      />

      {/* User Actions Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmUserAction !== null}
        title={
          confirmUserAction?.type === 'delete' 
            ? 'Hapus Akun Pengguna' 
            : (confirmUserAction?.type === 'suspend' ? 'Nonaktifkan Akun' : 'Aktifkan Akun')
        }
        message={
          confirmUserAction?.type === 'delete'
            ? `Apakah Anda yakin ingin menghapus akun ${confirmUserAction?.user?.email} secara permanen? Semua data proyek, saldo, dan riwayat transaksi akan dihapus dari sistem. Pengguna harus mendaftar kembali jika ingin menggunakan platform.`
            : (confirmUserAction?.type === 'suspend'
                ? `Apakah Anda yakin ingin menonaktifkan akun ${confirmUserAction?.user?.email}? Pengguna tidak akan dapat mengakses API atau masuk kembali ke dashboard Wuzzkang.`
                : `Apakah Anda yakin ingin mengaktifkan kembali akun ${confirmUserAction?.user?.email}? Pengguna akan mendapatkan akses penuh kembali ke platform.`)
        }
        confirmLabel={
          confirmUserAction?.type === 'delete' 
            ? 'Ya, Hapus Permanen' 
            : (confirmUserAction?.type === 'suspend' ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan')
        }
        cancelLabel="Batal"
        onConfirm={handleUserAction}
        onCancel={() => setConfirmUserAction(null)}
        variant={confirmUserAction?.type === 'delete' || confirmUserAction?.type === 'suspend' ? 'danger' : 'info'}
      />
    </PageLayout>
  );
}
