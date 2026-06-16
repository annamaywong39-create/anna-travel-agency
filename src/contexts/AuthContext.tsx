import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  country?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  isDemo: boolean;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

// ━━━ Demo-mode admin user ━━━
const DEMO_ADMIN: User = {
  id: 'admin-001',
  email: 'admin@annatravelagency.com',
  firstName: 'Anna',
  lastName: 'Admin',
  role: 'admin',
  createdAt: '2024-01-01',
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LOCAL-STORAGE helpers (demo mode)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function localLogin(email: string, password: string): { success: boolean; user?: User; error?: string } {
  if (email === 'admin@annatravelagency.com' && password === 'admin123') {
    return { success: true, user: DEMO_ADMIN };
  }
  const users = JSON.parse(localStorage.getItem('ath_users') || '[]');
  const found = users.find((u: User & { password: string }) => u.email === email && u.password === password);
  if (found) {
    const { password: _, ...userData } = found;
    return { success: true, user: userData as User };
  }
  return { success: false, error: 'Invalid email or password' };
}

function localSignup(data: SignupData): { success: boolean; user?: User; error?: string } {
  const users = JSON.parse(localStorage.getItem('ath_users') || '[]');
  if (users.some((u: User) => u.email === data.email)) {
    return { success: false, error: 'Email already registered' };
  }
  const newUser = {
    id: `user-${Date.now()}`,
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    role: 'user' as const,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  localStorage.setItem('ath_users', JSON.stringify(users));
  const { password: _, ...userData } = newUser;
  return { success: true, user: userData as User };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PROVIDER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isDemo = !isSupabaseConfigured;

  // ── Initialise session ──
  useEffect(() => {
    if (isDemo) {
      // Demo: restore from localStorage
      const stored = localStorage.getItem('ath_user');
      if (stored) setUser(JSON.parse(stored));
      setIsLoading(false);
    } else {
      // Production: check Supabase session
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setUser(profile);
        }
        setIsLoading(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setUser(profile);
        } else {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [isDemo]);

  // ── Fetch Supabase profile ──
  async function fetchProfile(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    const { data: { user: authUser } } = await supabase.auth.getUser();

    return {
      id: data.id,
      email: authUser?.email || '',
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone || undefined,
      country: data.country || undefined,
      role: data.role,
      createdAt: data.created_at,
    };
  }

  // ── Login ──
  const login = async (email: string, password: string) => {
    if (isDemo) {
      await new Promise(r => setTimeout(r, 800));
      const result = localLogin(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('ath_user', JSON.stringify(result.user));
      }
      return { success: result.success, error: result.error };
    }

    // Supabase auth
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };

    const profile = await fetchProfile(data.user.id);
    if (profile) setUser(profile);
    return { success: true };
  };

  // ── Signup ──
  const signup = async (signupData: SignupData) => {
    if (isDemo) {
      await new Promise(r => setTimeout(r, 800));
      const result = localSignup(signupData);
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('ath_user', JSON.stringify(result.user));
      }
      return { success: result.success, error: result.error };
    }

    // Supabase auth
    const { data, error } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options: {
        data: {
          first_name: signupData.firstName,
          last_name: signupData.lastName,
        },
      },
    });

    if (error) return { success: false, error: error.message };
    if (data.user) {
      const profile = await fetchProfile(data.user.id);
      if (profile) setUser(profile);
    }
    return { success: true };
  };

  // ── Logout ──
  const logout = () => {
    if (isDemo) {
      setUser(null);
      localStorage.removeItem('ath_user');
    } else {
      supabase.auth.signOut();
      setUser(null);
    }
  };

  // ── Update profile ──
  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);

    if (isDemo) {
      localStorage.setItem('ath_user', JSON.stringify(updated));
      const users = JSON.parse(localStorage.getItem('ath_users') || '[]');
      const idx = users.findIndex((u: User) => u.id === user.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...data };
        localStorage.setItem('ath_users', JSON.stringify(users));
      }
    } else {
      await supabase.from('profiles').update({
        first_name: updated.firstName,
        last_name: updated.lastName,
        phone: updated.phone,
        country: updated.country,
      }).eq('id', user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile, isDemo }}>
      {children}
    </AuthContext.Provider>
  );
}
