'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import { Plus, Globe, Calendar, CheckCircle, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, session, loading } = useAuth();
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-screen bg-theme-bg flex flex-col transition-theme">
      <Sidebar />

      {/* Main Content - Mobile-First */}
      <main className="flex-grow p-4 flex flex-col min-h-screen pt-20 pb-28 max-w-md mx-auto w-full bg-theme-surface border-x border-theme-border relative transition-theme">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-theme-text tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>Landing Pages</h1>
            <p className="text-theme-text-sec text-xs mt-1">Daftar semua landing page Anda yang telah digenerate</p>
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
            {projects.map((project) => (
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

                <div className="mt-5 pt-4 border-t border-theme-border flex items-center justify-end gap-2.5">
                  {project.status === 'deployed' ? (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center bg-theme-card hover:bg-theme-surface border border-theme-border text-theme-text font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <span>Lihat Website</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
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
            ))}
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
      </main>
    </div>
  );
}
