'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useModalHistory } from '@/hooks/useModalHistory';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import ConfirmDialog from '@/components/ConfirmDialog';
import AlertBanner from '@/components/AlertBanner';
import { Plus, Globe, Calendar, CheckCircle, Clock, AlertTriangle, ExternalLink, Share2, Copy, Send, X, Search, Link2, Loader2, Trash2, ChevronRight } from 'lucide-react';
import Skeleton from '@/components/Skeleton';

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

  // Pagination & Lazy loading state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const PROJECTS_LIMIT = parseInt(process.env.NEXT_PUBLIC_PROJECTS_PER_PAGE, 10) || 5;

  // Domain modal state
  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [domainProject, setDomainProject] = useState(null);
  const [subdomainInput, setSubdomainInput] = useState('');
  const [subdomainChecking, setSubdomainChecking] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState(null); // null | true | false
  const [subdomainClaiming, setSubdomainClaiming] = useState(false);
  const [subdomainReleasing, setSubdomainReleasing] = useState(false);
  const [domainClaimCost, setDomainClaimCost] = useState(null);
  const [domainError, setDomainError] = useState('');
  const [domainSuccess, setDomainSuccess] = useState('');
  const checkDebounceRef = useRef(null);

  // Use shared hooks for modal browser history management
  useModalHistory(shareModalOpen, 'share-modal', () => setShareModalOpen(false));
  useModalHistory(domainModalOpen, 'domain-modal', () => setDomainModalOpen(false));

  // Fetch systemSettings for max edits config
  useEffect(() => {
    const fetchProfileSettings = async () => {
      if (!session) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const result = await res.json();
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
    
    // Debounce search term requests
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
        // silently ignore, will show default
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

      // Update local state
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
    const targetProject = projectParam || domainProject;
    if (!targetProject) return;
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
        if (projectParam) {
          alert(result.error || 'Gagal menghapus subdomain.');
        } else {
          setDomainError(result.error || 'Gagal menghapus subdomain.');
        }
        return;
      }

      // Update local state
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
      
      if (projectParam) {
        alert('Subdomain berhasil dihapus. Credit tidak dikembalikan.');
      } else {
        setDomainSuccess('Subdomain berhasil dihapus. Credit tidak dikembalikan.');
        setSubdomainInput('');
        setSubdomainAvailable(null);
      }
    } catch (e) {
      if (projectParam) {
        alert('Terjadi kesalahan jaringan.');
      } else {
        setDomainError('Terjadi kesalahan jaringan.');
      }
    } finally {
      setSubdomainReleasing(false);
    }
  };

  const handleDeleteProject = async (projectParam = null) => {
    const targetProject = projectParam || projectToDelete;
    if (!targetProject) return;
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

      // Update local state
      setProjects((prev) => prev.filter((p) => p.id !== targetProject.id));
      alert('Project beserta seluruh asetnya berhasil dihapus.');
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="h-3 w-3" />
            <span>Aktif</span>
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="h-3 w-3" />
            <span>Draft</span>
          </span>
        );
      case 'deploying':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping"></span>
            <span>Memproses</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertTriangle className="h-3 w-3" />
            <span>Gagal</span>
          </span>
        );
    }
  };

  const getProjectTemplateType = (project) => {
    if (!project.page_data) return 'store';
    let config = project.page_data;
    if (typeof config === 'string') {
      try {
        config = JSON.parse(config);
      } catch (e) {
        return 'store';
      }
    }
    return config?.meta?.template_type || 'store';
  };

  const filteredProjects = projects;

  // Subdomain input display badge
  const renderSubdomainStatus = () => {
    if (!subdomainInput || subdomainInput.length < 3) return null;
    if (subdomainChecking) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] text-theme-text-muted">
          <Loader2 className="h-3 w-3 animate-spin" /> Mengecek...
        </span>
      );
    }
    if (subdomainAvailable === true) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
          <CheckCircle className="h-3 w-3" /> Tersedia
        </span>
      );
    }
    if (subdomainAvailable === false) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] text-red-400 font-bold">
          <X className="h-3 w-3" /> Sudah digunakan
        </span>
      );
    }
    return null;
  };

  return (
    <PageLayout>
        {/* Header */}
        <div className="flex flex-col gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-black text-theme-text tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>Landing Pages</h1>
            <p className="text-theme-text-sec text-xs mt-1">Daftar semua landing page Anda yang telah digenerate</p>
          </div>
        </div>

        {/* Sticky Search and Filter Controls */}
        <div
          className="sticky top-14 z-20 pb-3 pt-2 -mx-4 px-4 border-b transition-theme backdrop-blur-md"
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)'
          }}
        >
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4" style={{ color: 'var(--theme-text-muted)' }} />
            <input
              type="text"
              placeholder="Cari nama landing page..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none transition-theme"
              style={{
                backgroundColor: 'var(--theme-card)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-text)'
              }}
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'undangan', label: 'Undangan' },
              { id: 'bisnis', label: 'Toko / Bisnis' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilterType(t.id)}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${filterType === t.id
                    ? 'bg-theme-accent border-theme-accent text-theme-accent-text'
                    : 'bg-theme-card border-theme-border text-theme-text-sec hover:border-theme-text-muted'
                  }`}
                style={filterType !== t.id ? {
                  backgroundColor: 'var(--theme-card)',
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-text-sec)'
                } : {}}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content body */}
        {loading || fetching ? (
          <Skeleton type="card" count={3} />
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/25 text-red-400 rounded-2xl p-5 text-center text-xs">
            <p>{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="border border-dashed border-theme-border rounded-3xl p-10 text-center max-w-sm mx-auto mt-8 bg-theme-card/20 backdrop-blur-sm">
            <Globe className="h-12 w-12 text-theme-text-muted mx-auto mb-4" />
            <h3 className="text-base font-bold text-theme-text" style={{ fontFamily: "'Sora', sans-serif" }}>Belum Ada Halaman</h3>
            <p className="text-theme-text-sec text-xs mt-1 leading-relaxed mb-6">
              Anda belum membuat landing page apapun. Masukkan prompt pertama Anda untuk langsung membuat landing page otomatis!
            </p>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text text-xs font-bold py-3 px-5 rounded-xl shadow-lg transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Buat Sekarang</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.length === 0 ? (
              <div className="border border-dashed border-theme-border rounded-2xl p-8 text-center bg-theme-card/10 mt-2">
                <p className="text-theme-text-sec text-xs">Tidak ada landing page yang cocok dengan kriteria pencarian.</p>
              </div>
            ) : (
              filteredProjects.map((project) => {
                const templateType = getProjectTemplateType(project);
                return (
                  <div
                    key={project.id}
                    className="bg-theme-card/40 border border-theme-border rounded-2xl p-5 flex flex-col justify-between hover:border-theme-accent transition-all group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2.5">
                        <h3 className="text-sm font-bold text-theme-text group-hover:text-theme-accent transition-colors" style={{ fontFamily: "'Sora', sans-serif" }}>
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(project.status)}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setProjectToDelete(project);
                              setIsDeleteProjectOpen(true);
                            }}
                            className="p-1 rounded-lg text-theme-text-sec hover:bg-red-500/10 hover:text-red-400 transition-colors flex-shrink-0"
                            title="Hapus Project"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-theme-text-sec mt-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-theme-text-muted flex-shrink-0" />
                          <span>{new Date(project.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>

                        {(project.status === 'deployed') && (project.live_url || project.custom_domain) && (() => {
                          const displayUrl = (subdomainActive && project.custom_domain) 
                            ? `https://${project.custom_domain}` 
                            : project.live_url;
                          return (
                            <div className="flex items-center gap-2">
                              <Globe className="h-3.5 w-3.5 text-theme-text-muted flex-shrink-0" />
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

                        {/* Custom domain info row */}
                        {project.status === 'deployed' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openDomainModal(project)}
                              className="flex items-center gap-2 text-left group/domain min-w-0"
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
                                  <span className="text-theme-text-muted">Tambah subdomain</span>
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
                                className="p-1 rounded-lg text-theme-text-sec hover:bg-red-500/10 hover:text-red-400 transition-colors flex-shrink-0"
                                title="Hapus Subdomain"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
 
                    <div className="mt-5 pt-4 border-t border-theme-border flex flex-col gap-2">
                      {project.status === 'deployed' ? (
                        <div className="flex flex-col gap-2 w-full">
                          <div className="flex gap-2 w-full">
                            <a
                              href={(subdomainActive && project.custom_domain) ? `https://${project.custom_domain}` : project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 text-center bg-theme-card hover:bg-theme-surface border border-theme-border text-theme-text font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                            >
                              <span>Lihat</span>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                            {(templateType === 'wedding' || templateType === 'birthday' || templateType === 'toko-online' || templateType === 'campaign' || templateType === 'cv' || templateType === 'e-course') && (
                              (project.edit_count || 0) >= maxProjectEdits ? (
                                <Link
                                  href={`/generate?id=${project.id}&editMode=true`}
                                  className="flex-1 text-center bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1"
                                  title={`Jatah edit gratis habis. Edit berikutnya dikenakan biaya ${projectEditCost} Credit.`}
                                >
                                  <span>Edit ({projectEditCost} Credit)</span>
                                </Link>
                              ) : (
                                <Link
                                  href={`/generate?id=${project.id}&editMode=true`}
                                  className="flex-1 text-center bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text font-bold text-xs py-2.5 px-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1"
                                >
                                  <span>Edit ({maxProjectEdits - (project.edit_count || 0)}/{maxProjectEdits})</span>
                                </Link>
                              )
                            )}
                          </div>

                          {(templateType === 'wedding' || templateType === 'birthday') && (
                            <button
                              onClick={() => {
                                setShareProject(project);
                                setShareModalOpen(true);
                                setGuestName('');
                                setCopied(false);
                              }}
                              className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                            >
                              <Share2 className="h-3.5 w-3.5" />
                              <span>Bagikan Undangan</span>
                            </button>
                          )}
                        </div>
                      ) : project.status === 'draft' ? (
                        <Link
                          href={`/generate?id=${project.id}`}
                          className="w-full text-center bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1"
                        >
                          <span>Publikasikan Halaman</span>
                        </Link>
                      ) : (
                        <Link
                          href="/generate"
                          className="w-full text-center bg-theme-card hover:bg-theme-surface border border-theme-border text-theme-text-sec font-bold text-xs py-2.5 px-4 rounded-xl transition-all"
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
          <div className="flex justify-center pt-6">
            <button
              onClick={() => setPage(prev => prev + 1)}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 bg-theme-card hover:bg-theme-surface border border-theme-border text-theme-text hover:text-theme-accent text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-theme-accent" />
                  <span>Memuat...</span>
                </>
              ) : (
                <span>Tampilkan Lebih Banyak</span>
              )}
            </button>
          </div>
        )}

        {!fetching && !hasMore && projects.length > 0 && (
          <div className="text-center text-[10px] text-theme-text-muted pt-6">
            Menampilkan semua {totalCount} landing page.
          </div>
        )}



        {/* Share Modal */}
        {shareModalOpen && shareProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
            <div className="bg-theme-card border border-theme-border rounded-3xl w-full max-w-xs p-5 shadow-2xl relative text-theme-text animate-in fade-in zoom-in-95 duration-200">
              {/* Close button */}
              <button
                onClick={() => {
                  setShareModalOpen(false);
                  setShareProject(null);
                  setGuestName('');
                  setCopied(false);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-theme-border/50 text-theme-text-muted hover:text-theme-text transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <h3 className="text-sm font-bold mb-1 pr-6 tracking-tight text-theme-text" style={{ fontFamily: "'Sora', sans-serif" }}>
                🔗 Bagikan Undangan
              </h3>
              <p className="text-[10px] text-theme-text-sec mb-4 truncate">
                {shareProject.name}
              </p>

              <div className="space-y-4">
                {/* Base Link */}
                {(() => {
                  const baseShareUrl = (subdomainActive && shareProject.custom_domain) 
                    ? `https://${shareProject.custom_domain}` 
                    : shareProject.live_url;

                  return (
                    <>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider font-bold text-theme-text-muted mb-1">
                          Link Utama (Tanpa Nama)
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            readOnly
                            value={baseShareUrl || ''}
                            onClick={(e) => e.target.select()}
                            className="flex-grow bg-theme-surface border border-theme-border rounded-xl px-2.5 py-1.5 text-xs focus:outline-none text-theme-text truncate"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(baseShareUrl || '');
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className="p-2 rounded-xl border border-theme-border bg-theme-card hover:bg-theme-surface text-theme-text-muted hover:text-theme-text transition-all flex-shrink-0"
                            title="Salin Link"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Guest Input */}
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider font-bold text-theme-text-muted mb-1">
                          Nama Tamu Undangan
                        </label>
                        <input
                          type="text"
                          placeholder="Ketik nama tamu (misal: Budi)"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full bg-theme-surface border border-theme-border rounded-xl px-3 py-2 text-xs focus:border-theme-accent focus:outline-none text-theme-text"
                        />
                      </div>

                      {/* Personalized Link Details */}
                      {guestName.trim() && (() => {
                        const hasParams = baseShareUrl.includes('?');
                        const personalizedUrl = `${baseShareUrl}${hasParams ? '&' : '?'}to=${encodeURIComponent(guestName.trim())}`;
                        const waMessage = `Halo ${guestName.trim()},\n\nKami mengundang Anda untuk hadir di acara kami. Silakan buka tautan undangan online berikut untuk info detail:\n\n${personalizedUrl}`;
                        const waUrl = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;

                        return (
                          <div className="space-y-3 pt-3 border-t border-theme-border transition-all duration-200">
                            <div>
                              <label className="block text-[9px] uppercase tracking-wider font-bold text-theme-text-muted mb-1">
                                Link Khusus Tamu
                              </label>
                              <div className="flex gap-1.5">
                                <input
                                  type="text"
                                  readOnly
                                  value={personalizedUrl}
                                  onClick={(e) => e.target.select()}
                                  className="flex-grow bg-theme-surface border border-theme-border rounded-xl px-2.5 py-1.5 text-xs focus:outline-none text-theme-text truncate"
                                />
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(personalizedUrl);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                  }}
                                  className="p-2 rounded-xl border border-theme-border bg-theme-card hover:bg-theme-surface text-theme-text-muted hover:text-theme-text transition-all flex-shrink-0"
                                  title="Salin Link Khusus"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(personalizedUrl);
                                  setCopied(true);
                                  setTimeout(() => setCopied(false), 2000);
                                }}
                                className="flex-1 py-2 px-3 bg-theme-surface hover:bg-theme-card border border-theme-border text-theme-text rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                              >
                                <Copy className="h-3 w-3" />
                                <span>{copied ? 'Tersalin! ✅' : 'Salin'}</span>
                              </button>

                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 text-center shadow-md shadow-emerald-900/10"
                              >
                                <Send className="h-3 w-3" />
                                <span>Kirim WA</span>
                              </a>
                            </div>
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

        {/* Domain Modal */}
        {domainModalOpen && domainProject && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-theme-card border border-theme-border rounded-3xl w-full max-w-xs p-5 shadow-2xl relative text-theme-text animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
              {/* Close button */}
              <button
                onClick={closeDomainModal}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-theme-border/50 text-theme-text-muted hover:text-theme-text transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <Link2 className="h-4 w-4 text-theme-accent" />
                <h3 className="text-sm font-bold tracking-tight text-theme-text pr-6" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Custom Subdomain
                </h3>
              </div>
              <p className="text-[10px] text-theme-text-sec mb-4 truncate">{domainProject.name}</p>

              {/* Pricing badge */}
              {domainClaimCost !== null && !domainProject.custom_domain && (
                <div className="flex items-center gap-1.5 mb-4 px-3 py-2 rounded-xl bg-theme-accent/10 border border-theme-accent/20">
                  <span className="text-[10px] text-theme-text-sec">Biaya klaim:</span>
                  <span className="text-xs font-black text-theme-accent">{domainClaimCost} credit</span>
                  <span className="text-[10px] text-theme-text-muted ml-auto">sekali bayar</span>
                </div>
              )}

              {/* Success/Error messages */}
              {domainSuccess && (
                <div className="mb-3 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] flex items-start gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  <span>{domainSuccess}</span>
                </div>
              )}
              {domainError && (
                <div className="mb-3 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] flex items-start gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  <span>{domainError}</span>
                </div>
              )}

              {/* ACTIVE domain state */}
              {domainProject.custom_domain ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider font-bold text-theme-text-muted mb-1">
                      Domain Aktif
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        readOnly
                        value={`https://${domainProject.custom_domain}`}
                        onClick={(e) => e.target.select()}
                        className="flex-grow bg-theme-surface border border-emerald-500/30 rounded-xl px-2.5 py-2 text-xs text-emerald-400 font-bold focus:outline-none truncate"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://${domainProject.custom_domain}`);
                        }}
                        className="p-2 rounded-xl border border-theme-border bg-theme-card hover:bg-theme-surface text-theme-text-muted hover:text-theme-text transition-all flex-shrink-0"
                        title="Salin"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-theme-text-muted mt-1.5">Domain aktif dan dapat diakses oleh pengunjung.</p>
                  </div>

                  <a
                    href={`https://${domainProject.custom_domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 bg-theme-card hover:bg-theme-surface border border-theme-border text-theme-text font-bold text-xs py-2.5 px-4 rounded-xl transition-all"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Buka Domain</span>
                  </a>

                  <div className="pt-2 border-t border-theme-border">
                    <p className="text-[10px] text-theme-text-muted mb-2">⚠️ Menghapus subdomain bersifat permanen. Credit tidak dikembalikan.</p>
                    <button
                      onClick={handleReleaseSubdomain}
                      disabled={subdomainReleasing}
                      className="w-full flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold text-xs py-2.5 px-4 rounded-xl transition-all disabled:opacity-50"
                    >
                      {subdomainReleasing ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      <span>{subdomainReleasing ? 'Menghapus...' : 'Hapus Subdomain'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* CLAIM form */
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider font-bold text-theme-text-muted mb-1.5">
                      Nama Subdomain
                    </label>
                    <div className="flex items-center gap-0 rounded-xl border border-theme-border overflow-hidden focus-within:border-theme-accent transition-colors"
                      style={{ backgroundColor: 'var(--theme-surface)' }}>
                      <input
                        type="text"
                        placeholder="contoh: tokobudi"
                        value={subdomainInput}
                        onChange={(e) => setSubdomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        maxLength={15}
                        className="flex-1 bg-transparent px-3 py-2 text-xs text-theme-text focus:outline-none"
                        autoComplete="off"
                        autoCapitalize="none"
                      />
                      <span className="px-2 py-2 text-[10px] text-theme-text-muted bg-theme-card border-l border-theme-border whitespace-nowrap">
                        .siluet.web.id
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <div>{renderSubdomainStatus()}</div>
                      <span className="text-[10px] text-theme-text-muted">{subdomainInput.length}/15</span>
                    </div>
                    <p className="text-[10px] text-theme-text-muted mt-0.5">Min. 3 karakter. Hanya huruf kecil, angka, dan tanda hubung.</p>
                  </div>

                  <button
                    onClick={handleClaimSubdomain}
                    disabled={!subdomainAvailable || subdomainClaiming || subdomainChecking}
                    className="w-full flex items-center justify-center gap-1.5 bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {subdomainClaiming ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Mengklaim...</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="h-3.5 w-3.5" />
                        <span>
                          Klaim Subdomain
                          {domainClaimCost !== null && ` — ${domainClaimCost} credit`}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={isDeleteSubdomainOpen}
          title="Hapus Subdomain"
          message={`Apakah Anda yakin ingin menghapus subdomain ${subdomainToDelete?.custom_domain}? Tindakan ini bersifat permanen dan credit tidak dikembalikan.`}
          confirmLabel="Hapus"
          cancelLabel="Batal"
          variant="danger"
          onConfirm={() => {
            if (subdomainToDelete) {
              handleReleaseSubdomain(subdomainToDelete);
            }
            setIsDeleteSubdomainOpen(false);
            setSubdomainToDelete(null);
          }}
          onCancel={() => {
            setIsDeleteSubdomainOpen(false);
            setSubdomainToDelete(null);
          }}
        />

        <ConfirmDialog
          isOpen={isDeleteProjectOpen}
          title="Hapus Project"
          message={`Apakah Anda yakin ingin menghapus project "${projectToDelete?.name}" beserta seluruh asetnya secara permanen? Tindakan ini bersifat permanen, instan, dan tidak dapat dikembalikan.`}
          confirmLabel={projectDeleting ? "Menghapus..." : "Hapus"}
          cancelLabel="Batal"
          variant="danger"
          onConfirm={() => {
            if (projectToDelete) {
              handleDeleteProject(projectToDelete);
            }
          }}
          onCancel={() => {
            setIsDeleteProjectOpen(false);
            setProjectToDelete(null);
          }}
        />
      </PageLayout>
  );
}
