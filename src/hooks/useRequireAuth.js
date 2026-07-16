'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * useRequireAuth — Hook untuk memproteksi halaman dari user yang tidak login.
 *
 * Menggantikan pola yang berulang di hampir semua halaman:
 * useEffect(() => {
 *   if (!loading && !user) router.push('/login');
 * }, [user, loading, router]);
 *
 * @returns {{ user, session, profile, loading, refreshProfile }} - Nilai dari AuthContext
 *
 * Penggunaan:
 * const { user, session, profile, loading, refreshProfile } = useRequireAuth();
 */
export function useRequireAuth() {
  const auth = useAuth();
  const { user, loading } = auth;
  const router = useRouter();

  useEffect(() => {
    console.log('[useRequireAuth] loading:', loading, 'user exists:', !!user);
    if (!loading && !user) {
      console.log('[useRequireAuth] Redirecting to /login');
      router.push('/login');
    }
  }, [user, loading, router]);

  return auth;
}
