'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile from backend
  const fetchProfile = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setProfile(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    let currentToken = null;

    const cleanupOrphanedSessionImages = async (token) => {
      try {
        if (typeof window === 'undefined') return;
        const unsavedStr = localStorage.getItem('wuzzkang_unsaved_uploads');
        if (!unsavedStr) return;

        const unsaved = JSON.parse(unsavedStr);
        if (Array.isArray(unsaved) && unsaved.length > 0) {
          console.log('[AuthContext] Unsaved uploads from a crashed/aborted session detected. Cleaning up:', unsaved);

          for (const url of unsaved) {
            if (!url || url.includes('/defaults/')) continue;

            let path = '';
            try {
              const bucketMarker = '/wuzzkang-bucket/';
              const markerIdx = url.indexOf(bucketMarker);
              if (markerIdx !== -1) {
                path = url.substring(markerIdx + bucketMarker.length);
                const queryIdx = path.indexOf('?');
                if (queryIdx !== -1) {
                  path = path.substring(0, queryIdx);
                }
              }
            } catch (e) {
              console.error('[AuthContext] Error parsing image storage path during orphan cleanup:', e);
            }

            if (path) {
              try {
                console.log(`[AuthContext] Requesting server deletion for orphaned path: "${path}"`);
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ path }),
                });
              } catch (err) {
                console.error('[AuthContext] Error calling delete media API for orphaned asset:', err);
              }
            }
          }
        }
      } catch (err) {
        console.error('[AuthContext] Error in orphaned image cleanup flow:', err);
      } finally {
        try {
          localStorage.removeItem('wuzzkang_unsaved_uploads');
        } catch (e) {}
      }
    };

    const handleSessionChange = (newSession, event = null) => {
      const newToken = newSession?.access_token ?? null;
      const isTokenChanged = currentToken !== newToken;
      const isUserUpdated = event === 'USER_UPDATED';

      if (isTokenChanged || isUserUpdated) {
        currentToken = newToken;
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession) {
          fetchProfile(newSession.access_token);
          cleanupOrphanedSessionImages(newSession.access_token);
        } else {
          setProfile(null);
        }
      }
      setLoading(false);
    };

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSessionChange(session, 'INITIAL_SESSION');
    });

    // 2. Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      handleSessionChange(session, event);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (session?.access_token) {
      await fetchProfile(session.access_token);
    }
  };

  // Intercept window.fetch globally to catch 401 Unauthorized when a session is invalidated externally
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        const requestUrl = typeof args[0] === 'string' ? args[0] : (args[0] instanceof URL ? args[0].href : (args[0] && args[0].url));
        const isBackendApi = requestUrl && requestUrl.startsWith(process.env.NEXT_PUBLIC_API_URL);

        if (response.status === 401 && isBackendApi) {
          console.warn('[AuthContext] Intercepted backend 401 Unauthorized. Revoking credentials...');
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          if (currentSession) {
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setProfile(null);
          }
        }
        return response;
      } catch (err) {
        throw err;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
