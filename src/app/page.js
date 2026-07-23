'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useModalHistory } from '@/hooks/useModalHistory';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import ConfirmDialog from '@/components/ConfirmDialog';
import AlertBanner from '@/components/AlertBanner';
import { Plus, Globe, Calendar, CheckCircle, Clock, AlertTriangle, ExternalLink, Share2, Copy, Send, X, Search, Link2, Loader2, Trash2, ChevronRight, Sparkles, Layers, Zap } from 'lucide-react';
import Skeleton from '@/components/Skeleton';
import Loading from '@/components/Loading';

export default function DashboardPage() {
  const { user, session, loading } = useRequireAuth();
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareProject, setShareProject] = useState(null);
  const [isDeleteSubdomainOpen, setIsDeleteSubdomainOpen] = useState(false);
  const [subdomainToDelete, setSubdomainToDelete] = useState(null);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [projectDeleting, setProjectDeleting] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [maxProjectEdits, setMaxProjectEdits] = useState(0);
  const [projectEditCost, setProjectEditCost] = useState(1);
  const [subdomainActive, setSubdomainActive] = useState(true);
  const [profile, setProfile] = useState(null);

  // Pagination & Lazy loading state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const PROJECTS_LIMIT = parseInt(process.env.NEXT_PUBLIC_PROJECTS_PER_PAGE, 10) || 6;

  // Domain modal state
  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [domainProject, setDomainProject] = useState(null);
  const [subdomainInput, setSubdomainInput] = useState('');
  const [subdomainChecking, setSubdomainChecking] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState(null);
  const [subdomainClaiming, setSubdomainClaiming] = useState(false);
  const [subdomainReleasing, setSubdomainReleasing] = useState(false);
  const [domainClaimCost, setDomainClaimCost] = useState(null);
  const [domainError, setDomainError] = useState('');
  const [domainSuccess, setDomainSuccess] = useState('');
  const checkDebounceRef = useRef(null);

  // Use shared hooks for modal browser history management
  useModalHistory(shareModalOpen, 'share-modal', () => setShareModalOpen(false));
  useModalHistory(domainModalOpen, 'domain-modal', () => setDomainModalOpen(false));

  // Fetch profile and systemSettings
  useEffect(() => {
    const fetchProfileSettings = async () => {
      if (!session) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const result = await res.json();
          if (result.user || result.profile) {
            setProfile(result.user || result.profile);
          }
          if (result.systemSettings) {
            setMaxProjectEdits(result.systemSettings.max_project_edits || 3);
            setProjectEditCost(result.systemSettings.project_edit_cost || 1);
            setSubdomainActive(result.systemSettings.subdomain_active !== false);
          }
        }
      } catch (e) {
        // silently ignore
      }
    };
    fetchProfileSettings();
  }, [session?.access_token]);

  // Fetch projects from backend with pagination, search, and filtering
  const getProjects = async (pageToFetch, isReset = false) => {
    if (!session) return;
    try {
      if (isReset) {
        setFetching(true);
      } else {
        setLoadingMore(true);
      }
      
      const offset = (pageToFetch - 1) * PROJECTS_LIMIT;
      const url = `${process.env.NEXT_PUBLIC_API_URL}/projects?limit=${PROJECTS_LIMIT}&offset=${offset}&search=${encodeURIComponent(searchTerm)}&filter=${encodeURIComponent(filterType)}`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const fetchedProjects = result.data || [];
          const count = result.totalCount || 0;
          setTotalCount(count);
          
          if (isReset) {
            setProjects(fetchedProjects);
          } else {
            setProjects(prev => [...prev, ...fetchedProjects]);
          }
          
          setHasMore(offset + fetchedProjects.length < count);
        }
      } else {
        setError('Gagal memuat data proyek.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setFetching(false);
      setLoadingMore(false);
    }
  };

  // Handle reset search / filter triggers
  useEffect(() => {
    if (!session) return;
    setPage(1);
    setHasMore(true);
    
    const delayDebounceFn = setTimeout(() => {
      getProjects(1, true);
    }, searchTerm ? 400 : 0);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterType, session?.access_token]);

  // Handle page change (loading more)
  useEffect(() => {
    if (!session) return;
    if (page > 1) {
      getProjects(page, false);
    }
  }, [page]);

  // Fetch subdomain pricing when domain modal opens
  useEffect(() => {
    if (!domainModalOpen || !session || domainClaimCost !== null) return;
    const fetchPricing = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/domains/pricing`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const result = await res.json();
          if (result.success) setDomainClaimCost(result.data.cost);
        }
      } catch (e) {
        // silently ignore
      }
    };
    fetchPricing();
  }, [domainModalOpen, session?.access_token]);

  // Auto-check subdomain availability with debounce
  useEffect(() => {
    if (!subdomainInput || subdomainInput.length < 3 || domainProject?.custom_domain) {
      setSubdomainAvailable(null);
      return;
    }

    setSubdomainChecking(true);
    setSubdomainAvailable(null);

    if (checkDebounceRef.current) clearTimeout(checkDebounceRef.current);

    checkDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/domains/check?name=${encodeURIComponent(subdomainInput)}`,
          { headers: { Authorization: `Bearer ${session.access_token}` } }
        );
        if (res.ok) {
          const result = await res.json();
          if (result.success) {
            setSubdomainAvailable(result.data.available);
          }
        }
      } catch (e) {
        // silently ignore
      } finally {
        setSubdomainChecking(false);
      }
    }, 500);

    return () => {
      if (checkDebounceRef.current) clearTimeout(checkDebounceRef.current);
    };
  }, [subdomainInput, session?.access_token]);

  const openDomainModal = (project) => {
    setDomainProject(project);
    setSubdomainInput('');
    setSubdomainAvailable(null);
    setSubdomainChecking(false);
    setSubdomainClaiming(false);
    setSubdomainReleasing(false);
    setDomainError('');
    setDomainSuccess('');
    setDomainModalOpen(true);
  };

  const closeDomainModal = () => {
    setDomainModalOpen(false);
    setDomainProject(null);
  };

  const handleClaimSubdomain = async () => {
    if (!domainProject || !subdomainInput || !subdomainAvailable) return;
    setSubdomainClaiming(true);
    setDomainError('');
    setDomainSuccess('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/domains/claim-subdomain`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: domainProject.id,
          subdomain_name: subdomainInput,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setDomainError(result.error || 'Gagal mengklaim subdomain.');
        return;
      }

      const fullDomain = result.data.domain;
      setProjects((prev) =>
        prev.map((p) =>
          p.id === domainProject.id
            ? { ...p, custom_domain: fullDomain, domain_type: 'subdomain' }
            : p
        )
      );
      setDomainProject((prev) => ({ ...prev, custom_domain: fullDomain, domain_type: 'subdomain' }));
      setDomainSuccess(`Subdomain ${fullDomain} berhasil diklaim!`);
    } catch (e) {
      setDomainError('Terjadi kesalahan jaringan.');
    } finally {
      setSubdomainClaiming(false);
    }
  };

  const handleReleaseSubdomain = async (projectParam = null) => {
    const targetProject = (projectParam && projectParam.id) ? projectParam : domainProject;
    if (!targetProject || !targetProject.id) return;
    setSubdomainReleasing(true);
    setDomainError('');
    setDomainSuccess('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/domains/${targetProject.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        if (projectParam && projectParam.id) {
          alert(result.error || 'Gagal menghapus subdomain.');
        } else {
          setDomainError(result.error || 'Gagal menghapus subdomain.');
        }
        return;
      }

      setProjects((prev) =>
        prev.map((p) =>
          p.id === targetProject.id
            ? { ...p, custom_domain: null, domain_type: 'none' }
            : p
        )
      );
      if (domainProject?.id === targetProject.id) {
        setDomainProject((prev) => ({ ...prev, custom_domain: null, domain_type: 'none' }));
      }
      
      setIsDeleteSubdomainOpen(false);
      setSubdomainToDelete(null);

      if (projectParam && projectParam.id) {
        alert('Subdomain berhasil dihapus. Credit tidak dikembalikan.');
      } else {
        setDomainSuccess('Subdomain berhasil dihapus. Credit tidak dikembalikan.');
        setSubdomainInput('');
        setSubdomainAvailable(null);
      }
    } catch (e) {
      if (projectParam && projectParam.id) {
        alert('Terjadi kesalahan jaringan.');
      } else {
        setDomainError('Terjadi kesalahan jaringan.');
      }
    } finally {
      setSubdomainReleasing(false);
    }
  };

  const handleDeleteProject = async (projectParam = null) => {
    const targetProject = (projectParam && projectParam.id) ? projectParam : projectToDelete;
    if (!targetProject || !targetProject.id) return;
    setProjectDeleting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${targetProject.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        alert(result.error || 'Gagal menghapus project.');
        return;
      }

      setProjects((prev) => prev.filter((p) => p.id !== targetProject.id));
      alert('Project beserta seluruh asetnya (gambar & subdomain) berhasil dihapus.');
      setIsDeleteProjectOpen(false);
      setProjectToDelete(null);
    } catch (e) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setProjectDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'deployed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Aktif</span>
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="h-3 w-3" />
            <span>Draft</span>
          </span>
        );
      case 'deploying':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping"></span>
            <span>Memproses</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertTriangle className="h-3 w-3" />
            <span>Gagal</span>
          </span>
        );
    }
  };

  const getProjectTemplateType = (project) => {
    if (project.template_type) return project.template_type;
    if (!project.page_data) return 'store';
    let config = project.page_data;
    if (typeof config === 'string') {
      try {
        config = JSON.parse(config);
      } catch (e) {
        return 'store';
      }
    }
    return config?.meta?.template_type || config?.meta?.category || project.category || 'store';
  };

  const isWeddingProject = (project) => {
    if (!project) return false;
    
    const type = (project.template_type || '').toLowerCase();
    const category = (project.category || '').toLowerCase();
    if (type === 'wedding' || type === 'birthday' || type === 'undangan' || category === 'wedding' || category === 'undangan') {
      return true;
    }

    if (project.page_data) {
      let config = project.page_data;
      if (typeof config === 'string') {
        try { config = JSON.parse(config); } catch (e) {}
      }
      const metaType = (config?.meta?.template_type || '').toLowerCase();
      const metaCat = (config?.meta?.category || '').toLowerCase();
      if (metaType === 'wedding' || metaType === 'birthday' || metaType === 'undangan' || metaCat === 'wedding' || metaCat === 'undangan') {
        return true;
      }
      if (Array.isArray(config?.sections) && config.sections.some(s => s.type?.startsWith('wedding_'))) return true;
      if (Array.isArray(config?.v2_sections) && config.v2_sections.some(s => s.type?.startsWith('wedding_'))) return true;
    }

    const name = (project.name || '').toLowerCase();
    const weddingKeywords = ['nikah', 'wedding', 'undangan', 'mempelai', 'pasangan', 'pawiwahan', 'ulem', 'resepsi', 'akad'];
    if (weddingKeywords.some(kw => name.includes(kw))) {
      return true;
    }

    return false;
  };

  const filteredProjects = projects;

  if (loading || !user) {
    return <Loading fullScreen text="Memverifikasi Autentikasi..." size="lg" />;
  }

  return (
    <PageLayout>
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-theme-card via-theme-surface to-theme-bg border border-theme-border p-6 md:p-8 mb-6 shadow-xl transition-all">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-theme-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-accent/10 border border-theme-accent/20 text-theme-accent text-[11px] font-extrabold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>V2 Dynamic Builder Engine Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-theme-text tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
              Dashboard Landing Page
            </h1>
            <p className="text-theme-text-sec text-xs md:text-sm max-w-xl leading-relaxed">
              Daftar seluruh landing page milik Anda yang telah digenerate. Kelola konten, klaim subdomain, dan bagikan undangan instan secara efisien.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
            <Link
              href="/generate"
              className="inline-flex items-center justify-center gap-2 bg-theme-accent hover:bg-theme-accent-hover active:scale-95 text-theme-accent-text text-xs font-black py-3.5 px-6 rounded-2xl shadow-lg transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[3px]" />
              <span>Buat Halaman Baru</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid Bar */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-theme-border/60">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-theme-text-muted uppercase tracking-wider block">Total Halaman</span>
              <span className="text-sm md:text-base font-extrabold text-theme-text">{totalCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              <CheckCircle className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-theme-text-muted uppercase tracking-wider block">Aktif Deploy</span>
              <span className="text-sm md:text-base font-extrabold text-emerald-400">
                {projects.filter(p => p.status === 'deployed').length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-theme-text-muted uppercase tracking-wider block">Draft / Proses</span>
              <span className="text-sm md:text-base font-extrabold text-amber-400">
                {projects.filter(p => p.status !== 'deployed').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Search and Filter Controls */}
      <div
        className="sticky top-16 z-20 pb-4 pt-2 -mx-4 px-4 border-b transition-theme backdrop-blur-md mb-6"
        style={{
          backgroundColor: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)'
        }}
      >
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Filter Pill Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: 'Semua', count: totalCount },
              { id: 'undangan', label: 'Undangan', icon: '💒' },
              { id: 'bisnis', label: 'Toko / Bisnis', icon: '🛍️' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilterType(t.id)}
                className={`py-2 px-4 rounded-xl text-xs font-extrabold transition-all border flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  filterType === t.id
                    ? 'bg-theme-accent border-theme-accent text-theme-accent-text shadow-md scale-105'
                    : 'bg-theme-card border-theme-border text-theme-text-sec hover:border-theme-text-muted hover:text-theme-text'
                }`}
              >
                {t.icon && <span>{t.icon}</span>}
                <span>{t.label}</span>
                {t.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    filterType === t.id ? 'bg-white/20 text-white' : 'bg-theme-surface text-theme-text-muted'
                  }`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Glassmorphic Search Input */}
          <div className="relative min-w-[240px] sm:w-72">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-theme-text-muted" />
            <input
              type="text"
              placeholder="Cari nama landing page..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-theme-card border border-theme-border rounded-xl pl-10 pr-8 py-2 text-xs text-theme-text placeholder-theme-text-muted focus:outline-none focus:border-theme-accent transition-all shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-theme-text-muted hover:text-theme-text p-0.5 rounded-full"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Body Grid */}
      {loading || fetching ? (
        <Skeleton type="card" count={4} />
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/25 text-red-400 rounded-2xl p-5 text-center text-xs">
          <p>{error}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="border border-dashed border-theme-border rounded-3xl p-10 text-center max-w-sm mx-auto mt-8 bg-theme-card/20 backdrop-blur-sm">
          <Globe className="h-12 w-12 text-theme-text-muted mx-auto mb-4" />
          <h3 className="text-base font-bold text-theme-text" style={{ fontFamily: "'Sora', sans-serif" }}>Belum Ada Halaman</h3>
          <p className="text-theme-text-sec text-xs mt-1 leading-relaxed mb-6">
            Anda belum membuat landing page apapun. Buat landing page pertama Anda sekarang!
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text text-xs font-black py-3 px-5 rounded-xl shadow-lg transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Buat Sekarang</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full border border-dashed border-theme-border rounded-2xl p-8 text-center bg-theme-card/10 mt-2">
              <p className="text-theme-text-sec text-xs">Tidak ada landing page yang cocok dengan pencarian.</p>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const isWedding = isWeddingProject(project);
              const categoryBadge = isWedding 
                ? { label: 'Undangan Pernikahan', icon: '💒', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' } 
                : { label: 'Toko / Bisnis', icon: '🛍️', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };

              return (
                <div
                  key={project.id}
                  className="bg-theme-card/60 border border-theme-border hover:border-theme-accent/60 rounded-3xl p-5 md:p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
                >
                  <div>
                    {/* Header Top Row */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${categoryBadge.bg}`}>
                          <span>{categoryBadge.icon}</span>
                          <span>{categoryBadge.label}</span>
                        </span>
                        {getStatusBadge(project.status)}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToDelete(project);
                          setIsDeleteProjectOpen(true);
                        }}
                        className="p-1.5 rounded-xl text-theme-text-muted hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all flex-shrink-0 cursor-pointer"
                        title="Hapus Project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <h3 className="text-base font-black text-theme-text group-hover:text-theme-accent transition-colors line-clamp-1 mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {project.name}
                    </h3>

                    {/* Metadata & Subdomain */}
                    <div className="space-y-2 text-xs text-theme-text-sec mt-3">
                      <div className="flex items-center gap-2 text-[11px]">
                        <Calendar className="h-3.5 w-3.5 text-theme-text-muted flex-shrink-0" />
                        <span>Dibuat {new Date(project.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>

                      {(project.status === 'deployed') && (project.live_url || project.custom_domain) && (() => {
                        const displayUrl = (subdomainActive && project.custom_domain) 
                          ? `https://${project.custom_domain}` 
                          : project.live_url;
                        return (
                          <div className="flex items-center gap-2 text-[11px] pt-1 border-t border-theme-border/50">
                            <Globe className="h-3.5 w-3.5 text-theme-accent flex-shrink-0" />
                            <a
                              href={displayUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-theme-accent hover:text-theme-accent-hover font-bold truncate flex items-center gap-1 hover:underline"
                            >
                              <span className="truncate">{displayUrl ? displayUrl.replace(/^https?:\/\//, '') : ''}</span>
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                          </div>
                        );
                      })()}

                      {/* Subdomain Manager Row */}
                      {project.status === 'deployed' && (
                        <div className="flex items-center gap-2 text-[11px]">
                          <button
                            onClick={() => openDomainModal(project)}
                            className="flex items-center gap-2 text-left group/domain min-w-0 cursor-pointer"
                          >
                            <Link2 className="h-3.5 w-3.5 flex-shrink-0 text-theme-text-muted group-hover/domain:text-theme-accent transition-colors" />
                            {project.custom_domain ? (
                              <span className="flex items-center gap-1.5 min-w-0">
                                <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${subdomainActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                <span className={`${subdomainActive ? 'text-emerald-400' : 'text-red-400'} font-bold truncate`}>
                                  {project.custom_domain} {!subdomainActive && '(Nonaktif)'}
                                </span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5">
                                <span className="text-theme-text-muted hover:text-theme-accent transition-colors">+ Subdomain Kustom</span>
                                <ChevronRight className="h-3 w-3 text-theme-text-muted group-hover/domain:text-theme-accent transition-colors" />
                              </span>
                            )}
                          </button>
                          {project.custom_domain && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSubdomainToDelete(project);
                                setIsDeleteSubdomainOpen(true);
                              }}
                              className="p-1 rounded-lg text-theme-text-sec hover:bg-red-500/10 hover:text-red-400 transition-colors flex-shrink-0 cursor-pointer"
                              title="Hapus Subdomain"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Bar */}
                  <div className="mt-5 pt-4 border-t border-theme-border flex flex-col gap-2.5">
                    {project.status === 'deployed' ? (
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex gap-2 w-full">
                          <a
                            href={(subdomainActive && project.custom_domain) ? `https://${project.custom_domain}` : project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center bg-theme-surface hover:bg-theme-bg border border-theme-border text-theme-text font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                          >
                            <span>Lihat</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>

                          {(project.edit_count || 0) >= maxProjectEdits ? (
                            <Link
                              href={`/generate?id=${project.id}&editMode=true`}
                              className="flex-1 text-center bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                              title={`Jatah edit gratis habis. Edit berikutnya dikenakan biaya ${projectEditCost} Credit.`}
                            >
                              <span>Edit ({projectEditCost} Cr)</span>
                            </Link>
                          ) : (
                            <Link
                              href={`/generate?id=${project.id}&editMode=true`}
                              className="flex-1 text-center bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text font-black text-xs py-2.5 px-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                            >
                              <span>Edit ({maxProjectEdits - (project.edit_count || 0)}/{maxProjectEdits})</span>
                            </Link>
                          )}
                        </div>

                        {isWedding && (
                          <button
                            onClick={() => {
                              setShareProject(project);
                              setShareModalOpen(true);
                              setGuestName('');
                              setCopied(false);
                            }}
                            className="w-full text-center bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                            <span>Bagikan Undangan</span>
                          </button>
                        )}
                      </div>
                    ) : project.status === 'draft' ? (
                      <Link
                        href={`/generate?id=${project.id}`}
                        className="w-full text-center bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text font-black text-xs py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                      >
                        <span>Publikasikan Halaman</span>
                      </Link>
                    ) : (
                      <Link
                        href="/generate"
                        className="w-full text-center bg-theme-card hover:bg-theme-surface border border-theme-border text-theme-text-sec font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                      >
                        Coba Buat Lagi
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Pagination & Load More Controls */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={() => setPage(prev => prev + 1)}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 bg-theme-card hover:bg-theme-surface border border-theme-border text-theme-text hover:text-theme-accent text-xs font-bold py-3 px-6 rounded-2xl transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-theme-accent" />
                <span>Memuat Data...</span>
              </>
            ) : (
              <span>Tampilkan Lebih Banyak</span>
            )}
          </button>
        </div>
      )}

      {!fetching && !hasMore && projects.length > 0 && (
        <div className="text-center text-[11px] text-theme-text-muted pt-8 pb-4">
          Menampilkan semua {totalCount} landing page.
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && shareProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
          <div className="bg-theme-card border border-theme-border rounded-3xl w-full max-w-sm p-6 shadow-2xl relative text-theme-text animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setShareModalOpen(false);
                setShareProject(null);
                setGuestName('');
                setCopied(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-theme-border/50 text-theme-text-muted hover:text-theme-text transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-black mb-1 pr-6 tracking-tight text-theme-text" style={{ fontFamily: "'Sora', sans-serif" }}>
              🔗 Bagikan Undangan
            </h3>
            <p className="text-xs text-theme-text-sec mb-5 truncate font-medium">
              {shareProject.name}
            </p>

            <div className="space-y-4">
              {(() => {
                const baseShareUrl = (subdomainActive && shareProject.custom_domain) 
                  ? `https://${shareProject.custom_domain}` 
                  : shareProject.live_url;

                return (
                  <>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-extrabold text-theme-text-muted mb-1.5">
                        Link Utama (Tanpa Nama Tamu)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={baseShareUrl || ''}
                          onClick={(e) => e.target.select()}
                          className="flex-grow bg-theme-surface border border-theme-border rounded-xl px-3 py-2 text-xs focus:outline-none text-theme-text font-mono truncate"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(baseShareUrl || '');
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="px-3 py-2 rounded-xl border border-theme-border bg-theme-surface hover:bg-theme-bg text-theme-text font-bold text-xs transition-all flex-shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95"
                          title="Salin Link"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span>{copied ? '✓ Copied' : 'Salin'}</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-extrabold text-theme-text-muted mb-1.5">
                        Nama Tamu Undangan
                      </label>
                      <input
                        type="text"
                        placeholder="Ketik nama tamu (misal: Budi & Keluarga)"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-theme-surface border border-theme-border rounded-xl px-3.5 py-2.5 text-xs focus:border-theme-accent focus:outline-none text-theme-text font-medium"
                      />
                    </div>

                    {guestName.trim() && (() => {
                      const hasParams = (baseShareUrl || '').includes('?');
                      const personalizedUrl = `${baseShareUrl}${hasParams ? '&' : '?'}to=${encodeURIComponent(guestName.trim())}`;
                      const waMessage = `Halo ${guestName.trim()},\n\nKami mengundang Anda untuk hadir di acara kami. Silakan buka tautan undangan online berikut untuk info detail:\n\n${personalizedUrl}`;
                      const waUrl = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;

                      return (
                        <div className="space-y-3 pt-3 border-t border-theme-border transition-all duration-200">
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider font-extrabold text-theme-text-muted mb-1.5">
                              Link Khusus Tamu ({guestName.trim()})
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                readOnly
                                value={personalizedUrl}
                                onClick={(e) => e.target.select()}
                                className="flex-grow bg-theme-surface border border-theme-border rounded-xl px-3 py-2 text-xs focus:outline-none text-theme-text font-mono truncate"
                              />
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(personalizedUrl);
                                  alert('Link khusus tamu berhasil disalin!');
                                }}
                                className="px-3 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text font-bold text-xs transition-all flex-shrink-0 cursor-pointer active:scale-95"
                              >
                                Salin
                              </button>
                            </div>
                          </div>

                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                          >
                            <Send className="h-4 w-4" />
                            <span>Kirimkan via WhatsApp</span>
                          </a>
                        </div>
                      );
                    })()}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Subdomain Management Modal */}
      {domainModalOpen && domainProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
          <div className="bg-theme-card border border-theme-border rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-theme-text animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={closeDomainModal}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-theme-border/50 text-theme-text-muted hover:text-theme-text transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-theme-accent/15 border border-theme-accent/30 text-theme-accent flex items-center justify-center font-bold">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black tracking-tight text-theme-text" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {domainProject.custom_domain ? 'Kelola Subdomain' : 'Klaim Subdomain Kustom'}
                </h3>
                <p className="text-xs text-theme-text-sec truncate max-w-[240px]">
                  {domainProject.name}
                </p>
              </div>
            </div>

            {domainError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{domainError}</span>
              </div>
            )}

            {domainSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <span>{domainSuccess}</span>
              </div>
            )}

            {!subdomainActive && (
              <div className="mb-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs leading-relaxed">
                ⚠️ Fitur subdomain kustom saat ini sedang ditangguhkan sementara oleh administrator.
              </div>
            )}

            {domainProject.custom_domain ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border space-y-2">
                  <span className="text-[10px] uppercase font-extrabold text-theme-text-muted tracking-wider block">
                    Subdomain Aktif Saat Ini
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={`https://${domainProject.custom_domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-black text-theme-accent hover:underline truncate"
                    >
                      https://{domainProject.custom_domain}
                    </a>
                    <ExternalLink className="h-4 w-4 text-theme-accent flex-shrink-0" />
                  </div>
                </div>

                <div className="pt-2 border-t border-theme-border flex gap-3">
                  <button
                    onClick={closeDomainModal}
                    className="flex-1 bg-theme-surface hover:bg-theme-bg border border-theme-border text-theme-text font-bold text-xs py-3 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => handleReleaseSubdomain()}
                    disabled={subdomainReleasing}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {subdomainReleasing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Melepas...</span>
                      </>
                    ) : (
                      <span>Hapus Subdomain</span>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-extrabold text-theme-text-muted mb-1.5">
                    Nama Subdomain Yang Diinginkan
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="misal: nikahanku"
                      value={subdomainInput}
                      onChange={(e) => setSubdomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      disabled={!subdomainActive || subdomainClaiming}
                      className="w-full bg-theme-surface border border-theme-border rounded-xl pl-3.5 pr-28 py-2.5 text-xs text-theme-text placeholder-theme-text-muted focus:border-theme-accent focus:outline-none font-mono"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-theme-text-muted">
                      .siluet.web.id
                    </span>
                  </div>

                  <div className="mt-2 min-h-[20px]">
                    {subdomainChecking && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-theme-text-muted">
                        <Loader2 className="h-3 w-3 animate-spin text-theme-accent" />
                        <span>Mengecek ketersediaan...</span>
                      </span>
                    )}
                    {!subdomainChecking && subdomainAvailable === true && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-extrabold">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Subdomain tersedia!</span>
                      </span>
                    )}
                    {!subdomainChecking && subdomainAvailable === false && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-red-400 font-extrabold">
                        <X className="h-3.5 w-3.5" />
                        <span>Subdomain sudah digunakan orang lain.</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-border text-xs text-theme-text-sec space-y-1">
                  <div className="flex justify-between items-center">
                    <span>Biaya Klaim Subdomain:</span>
                    <span className="font-mono font-black text-theme-text">
                      {domainClaimCost !== null ? `${domainClaimCost} Credit` : 'Gratis / Standard'}
                    </span>
                  </div>
                  <p className="text-[10px] text-theme-text-muted pt-1">
                    Subdomain kustom memungkinkan landing page Anda diakses langsung via link profesional pilihan Anda.
                  </p>
                </div>

                <div className="pt-2 border-t border-theme-border flex gap-3">
                  <button
                    onClick={closeDomainModal}
                    className="flex-1 bg-theme-surface hover:bg-theme-bg border border-theme-border text-theme-text font-bold text-xs py-3 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleClaimSubdomain}
                    disabled={!subdomainActive || !subdomainInput || !subdomainAvailable || subdomainClaiming}
                    className="flex-1 bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text font-black text-xs py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {subdomainClaiming ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Mengklaim...</span>
                      </>
                    ) : (
                      <span>Klaim Subdomain</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Project Confirm Dialog */}
      <ConfirmDialog
        isOpen={isDeleteProjectOpen}
        onCancel={() => {
          setIsDeleteProjectOpen(false);
          setProjectToDelete(null);
        }}
        onConfirm={() => handleDeleteProject(projectToDelete)}
        title="Hapus Landing Page?"
        message={`Apakah Anda yakin ingin menghapus "${projectToDelete?.name || 'Project'}"? Seluruh data halaman, subdomain, dan file media yang diunggah akan dihapus secara permanen.`}
        confirmLabel="Hapus Permanen"
        cancelLabel="Batal"
        variant="danger"
      />

      {/* Delete Subdomain Confirm Dialog */}
      <ConfirmDialog
        isOpen={isDeleteSubdomainOpen}
        onCancel={() => {
          setIsDeleteSubdomainOpen(false);
          setSubdomainToDelete(null);
        }}
        onConfirm={() => handleReleaseSubdomain(subdomainToDelete)}
        title="Hapus Subdomain?"
        message={`Apakah Anda yakin ingin melepas subdomain "${subdomainToDelete?.custom_domain}"? Subdomain akan dapat diklaim oleh pengguna lain.`}
        confirmLabel="Hapus Subdomain"
        cancelLabel="Batal"
        variant="warning"
      />
    </PageLayout>
  );
}
