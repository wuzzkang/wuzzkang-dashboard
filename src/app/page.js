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
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-8 pt-24 md:pt-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Landing Pages</h1>
            <p className="text-slate-400 text-sm mt-1">Daftar semua landing page Anda yang telah digenerate</p>
          </div>
          
          <Link
            href="/generate"
            className="w-full sm:w-auto justify-center bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/15 transition-all flex items-center gap-2 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>Buat Halaman Baru</span>
          </Link>
        </div>

        {/* Content body */}
        {fetching ? (
          <div className="h-64 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/25 text-red-400 rounded-2xl p-6 text-center max-w-xl mx-auto">
            <p>{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-3xl p-16 text-center max-w-xl mx-auto mt-12 bg-slate-900/10 backdrop-blur-sm">
            <Globe className="h-16 w-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Belum Ada Halaman</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto mb-6">
              Anda belum membuat landing page apapun. Masukkan prompt pertama Anda untuk langsung membuat landing page otomatis!
            </p>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-3 px-6 rounded-xl shadow-lg transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Buat Sekarang</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {project.name}
                    </h3>
                    {getStatusBadge(project.status)}
                  </div>
                  
                  <div className="space-y-3.5 text-sm text-slate-400 mt-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      <span>{new Date(project.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>

                    {project.status === 'deployed' && project.live_url && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-slate-500 flex-shrink-0" />
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 font-medium truncate flex items-center gap-1 hover:underline"
                        >
                          <span className="truncate">{project.live_url.replace(/^https?:\/\//, '')}</span>
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-end gap-3">
                  {project.status === 'deployed' ? (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <span>Lihat Website</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : project.status === 'draft' ? (
                    <Link
                      href={`/generate?id=${project.id}`}
                      className="w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1"
                    >
                      <span>Publikasikan Halaman</span>
                    </Link>
                  ) : (
                    <Link
                      href="/generate"
                      className="w-full text-center bg-slate-800 hover:bg-slate-700 text-slate-400 font-semibold text-xs py-2.5 px-4 rounded-xl transition-all"
                    >
                      Coba Buat Lagi
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
