import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

type UserRole = 'user' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  country?: string;
  createdAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthReady: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: { firstName?: string; lastName?: string; phone?: string; country?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function fromAuthUser(authUser: { id: string; email?: string | null; created_at?: string; user_metadata?: Record<string, unknown> }, profile?: Record<string, unknown> | null): AuthUser {
  const metadata = authUser.user_metadata || {};
  return {
    id: authUser.id,
    email: authUser.email || String(profile?.email || ''),
    firstName: String(profile?.first_name || metadata.firstName || metadata.first_name || 'Traveler'),
    lastName: String(profile?.last_name || metadata.lastName || metadata.last_name || ''),
    role: profile?.role === 'admin' ? 'admin' : 'user',
    phone: profile?.phone ? String(profile.phone) : authUser.user_metadata?.phone ? String(authUser.user_metadata.phone) : undefined,
    country: profile?.country ? String(profile.country) : undefined,
    createdAt: String(profile?.created_at || authUser.created_at || new Date().toISOString()),
  };
}

async function loadProfile(authUser: { id: string; email?: string | null; created_at?: string; user_metadata?: Record<string, unknown> }) {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
  return fromAuthUser(authUser, data);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsAuthReady(true);
      return;
    }

    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      if (data.session?.user) setUser(await loadProfile(data.session.user));
      setIsAuthReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (!session?.user) {
        setUser(null);
        return;
      }
      // Avoid awaiting Supabase calls inside the auth callback.
      void loadProfile(session.user).then((profile) => mounted && setUser(profile));
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured) return { success: false, error: 'Authentication is not configured yet.' };
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return error ? { success: false, error: error.message } : { success: true };
  };

  const signup = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    if (!isSupabaseConfigured) return { success: false, error: 'Authentication is not configured yet.' };
    const { error } = await supabase.auth.signUp({
      email: data.email.trim().toLowerCase(),
      password: data.password,
      options: { data: { firstName: data.firstName.trim(), lastName: data.lastName.trim() } },
    });
    return error ? { success: false, error: error.message } : { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (data: { firstName?: string; lastName?: string; phone?: string; country?: string }) => {
    if (!user || !isSupabaseConfigured) return;
    const patch = {
      ...(data.firstName !== undefined ? { first_name: data.firstName } : {}),
      ...(data.lastName !== undefined ? { last_name: data.lastName } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.country !== undefined ? { country: data.country } : {}),
    };
    const { error } = await supabase.from('profiles').update(patch).eq('id', user.id);
    if (error) throw error;
    setUser((current) => current ? { ...current, firstName: data.firstName ?? current.firstName, lastName: data.lastName ?? current.lastName, phone: data.phone ?? current.phone, country: data.country ?? current.country } : current);
  };

  const value = useMemo(() => ({ user, isAuthReady, login, signup, logout, updateProfile }), [user, isAuthReady]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
