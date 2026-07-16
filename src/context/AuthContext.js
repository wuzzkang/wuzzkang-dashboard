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
