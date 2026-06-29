'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import { Plus, Globe, Calendar, CheckCircle, Clock, AlertTriangle, ExternalLink, Share2, Copy, Send, X, Search } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, session, loading } = useAuth();
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareProject, setShareProject] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch projects from backend
  useEffect(() => {
    const getProjects = async () => {
      if (!session) return;
      try {
        setFetching(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setProjects(result.data);
          }
        } else {
          setError('Gagal memuat data proyek.');
        }
      } catch (err) {
        setError('Terjadi kesalahan jaringan.');
      } finally {
        setFetching(false);
      }
    };

    if (session) {
      getProjects();
    }
  }, [session]);

  if (loading || (!user && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="h-12 w-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

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

  const filteredProjects = projects.filter((project) => {
    const templateType = getProjectTemplateType(project);
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'undangan') {
      return matchesSearch && (templateType === 'wedding' || templateType === 'birthday');
    }
    if (filterType === 'bisnis') {
      return matchesSearch && templateType === 'store';
    }
    return matchesSearch && templateType === filterType;
  });

  return (
    <div className="min-h-screen bg-theme-bg flex flex-col transition-theme">
      <Sidebar />

      {/* Main Content - Mobile-First */}
      <main className="flex-grow p-4 flex flex-col min-h-screen pt-20 pb-28 max-w-md mx-auto w-full bg-theme-surface border-x border-theme-border relative transition-theme">
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
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${
                  filterType === t.id
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
        {fetching ? (
          <div className="h-64 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-2 border-theme-accent/20 border-t-theme-accent animate-spin"></div>
          </div>
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
                        {getStatusBadge(project.status)}
                      </div>
                      
                      <div className="space-y-2 text-xs text-theme-text-sec mt-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-theme-text-muted flex-shrink-0" />
                          <span>{new Date(project.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>

                        {project.status === 'deployed' && project.live_url && (
                          <div className="flex items-center gap-2">
                            <Globe className="h-3.5 w-3.5 text-theme-text-muted flex-shrink-0" />
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-theme-accent hover:text-theme-accent-hover font-bold truncate flex items-center gap-1 hover:underline"
                            >
                              <span className="truncate">{project.live_url.replace(/^https?:\/\//, '')}</span>
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-theme-border flex flex-col gap-2">
                      {project.status === 'deployed' ? (
                        <div className="flex flex-col gap-2 w-full">
                          <div className="flex gap-2 w-full">
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 text-center bg-theme-card hover:bg-theme-surface border border-theme-border text-theme-text font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                            >
                              <span>Lihat</span>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                            {(templateType === 'wedding' || templateType === 'birthday') && (
                              (project.edit_count || 0) >= 3 ? (
                                <button
                                  disabled
                                  className="flex-1 text-center bg-theme-border/50 text-theme-text-muted font-bold text-xs py-2.5 px-3 rounded-xl cursor-not-allowed border border-theme-border"
                                  title="Batas edit habis (maksimal 3x). Silakan hubungi admin."
                                >
                                  Edit (0/3)
                                </button>
                              ) : (
                                <Link
                                  href={`/generate?id=${project.id}&editMode=true`}
                                  className="flex-1 text-center bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text font-bold text-xs py-2.5 px-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1"
                                >
                                  <span>Edit ({3 - (project.edit_count || 0)}/3)</span>
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

        {/* Sticky Mobile Fab Button for Creating New Landing Page */}
        <div className="fixed bottom-6 right-6 z-40 max-w-md mx-auto pointer-events-none w-full pr-12 flex justify-end">
          <Link
            href="/generate"
            className="pointer-events-auto h-12 w-12 rounded-full bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          >
            <Plus className="h-6 w-6 font-bold" />
          </Link>
        </div>

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
                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-theme-text-muted mb-1">
                    Link Utama (Tanpa Nama)
                  </label>
                  <div className="flex gap-1.5">
                    <input 
                      type="text" 
                      readOnly 
                      value={shareProject.live_url || ''} 
                      onClick={(e) => e.target.select()}
                      className="flex-grow bg-theme-surface border border-theme-border rounded-xl px-2.5 py-1.5 text-xs focus:outline-none text-theme-text truncate"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(shareProject.live_url || '');
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
                  const hasParams = shareProject.live_url.includes('?');
                  const personalizedUrl = `${shareProject.live_url}${hasParams ? '&' : '?'}to=${encodeURIComponent(guestName.trim())}`;
                  const waMessage = `Halo ${guestName.trim()},\n\nKami mengundang Anda untuk hadir di acara kami. Silakan buka tautan undangan online berikut untuk info detail:\n\n${personalizedUrl}`;
                  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waMessage)}`;

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
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
