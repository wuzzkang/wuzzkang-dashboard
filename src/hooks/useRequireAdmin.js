'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * useRequireAdmin — Hook to protect admin-only pages.
 *
 * Redirects to /login if not authenticated.
 * Redirects to / (home) if authenticated but role is not 'admin' or 'super_admin'.
 *
 * Pattern: same as useRequireAuth.js + role check.
 *
 * @returns {{ user, session, profile, loading, refreshProfile }}
 */
export function useRequireAdmin() {
  const auth = useAuth();
  const { user, profile, loading } = auth;
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Still loading, wait

    if (!user) {
      console.log('[useRequireAdmin] No user, redirecting to /login');
      router.push('/login');
      return;
    }

    // Wait for profile to be fetched (it loads async after user is set)
    if (!profile) return;

    const role = profile.role;
    if (role !== 'admin' && role !== 'super_admin') {
      console.warn('[useRequireAdmin] User role is:', role, '— redirecting to /');
      router.push('/');
    }
  }, [user, profile, loading, router]);

  return auth;
}
