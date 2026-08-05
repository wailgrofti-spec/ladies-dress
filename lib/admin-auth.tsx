'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createBrowserSupabaseClient } from './supabase/client';

interface AdminAuthValue {
  isAuthenticated: boolean;
  loading: boolean;
  isDemoMode: boolean;
  email: string | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);
const DEMO_KEY = 'ladiesdress_admin_demo_session';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const supabase = createBrowserSupabaseClient();
  const isDemoMode = !supabase;

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        setIsAuthenticated(!!data.session);
        setEmail(data.session?.user.email ?? null);
        setLoading(false);
      });
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session);
        setEmail(session?.user.email ?? null);
      });
      return () => listener.subscription.unsubscribe();
    } else {
      // Mode démo : session stockée localement, uniquement pour tester
      // l'interface avant d'avoir configuré Supabase Auth.
      try {
        const stored = window.localStorage.getItem(DEMO_KEY);
        if (stored) {
          setIsAuthenticated(true);
          setEmail(stored);
        }
      } catch {}
      setLoading(false);
    }
  }, [supabase]);

  async function login(loginEmail: string, password: string) {
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
      if (error) return { error: error.message };
      return {};
    }
    // Démo : identifiants fixes, uniquement en local sans Supabase configuré
    if (loginEmail === 'admin@ladiesdress.ma' && password === 'demo1234') {
      window.localStorage.setItem(DEMO_KEY, loginEmail);
      setIsAuthenticated(true);
      setEmail(loginEmail);
      return {};
    }
    return { error: 'Identifiants incorrects (mode démo : admin@ladiesdress.ma / demo1234)' };
  }

  async function logout() {
    if (supabase) await supabase.auth.signOut();
    else window.localStorage.removeItem(DEMO_KEY);
    setIsAuthenticated(false);
    setEmail(null);
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, loading, isDemoMode, email, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
