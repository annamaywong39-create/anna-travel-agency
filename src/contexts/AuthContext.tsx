import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

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
  password?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthReady: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: { firstName?: string; lastName?: string; phone?: string; country?: string }) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS_KEY = 'ath_users';
const DEMO_SESSION_KEY = 'ath_session';

function safeParseUsers(): AuthUser[] {
  if (typeof window === 'undefined') return [];

  try {
    const saved = window.localStorage.getItem(DEMO_USERS_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved) as AuthUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function createDemoAdmin(): AuthUser {
  return {
    id: 'demo-admin',
    email: 'admin@annatravelagency.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    createdAt: new Date().toISOString(),
  };
}

function bootUsers() {
  if (typeof window === 'undefined') return;

  const currentUsers = safeParseUsers();
  if (currentUsers.length === 0) {
    window.localStorage.setItem(DEMO_USERS_KEY, JSON.stringify([createDemoAdmin()]));
  }
}

function sanitizeUser(user: Partial<AuthUser> | null): AuthUser | null {
  if (!user || !user.id || !user.email || !user.firstName || !user.lastName) return null;
  return {
    id: String(user.id),
    email: String(user.email),
    firstName: String(user.firstName),
    lastName: String(user.lastName),
    role: user.role === 'admin' ? 'admin' : 'user',
    phone: user.phone ? String(user.phone) : undefined,
    country: user.country ? String(user.country) : undefined,
    createdAt: user.createdAt ? String(user.createdAt) : new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    bootUsers();

    const session = window.localStorage.getItem(DEMO_SESSION_KEY);
    if (session) {
      try {
        const parsedSession = JSON.parse(session) as Partial<AuthUser>;
        const hydratedUser = sanitizeUser(parsedSession);
        if (hydratedUser) {
          setUser(hydratedUser);
        }
      } catch {
        window.localStorage.removeItem(DEMO_SESSION_KEY);
      }
    }

    setIsAuthReady(true);
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    if (user) {
      window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(DEMO_SESSION_KEY);
    }
  }, [isAuthReady, user]);

  const login = async (email: string, password: string) => {
    const users = safeParseUsers();
    const match = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password);

    if (!match) {
      return { success: false, error: 'Invalid email or password' };
    }

    const sessionUser = sanitizeUser(match);
    if (!sessionUser) {
      return { success: false, error: 'Unable to restore account data' };
    }

    setUser(sessionUser);
    return { success: true };
  };

  const signup = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    const users = safeParseUsers();
    const email = data.email.trim().toLowerCase();

    if (users.some((entry) => entry.email.toLowerCase() === email)) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const nextUser: AuthUser = {
      id: `user-${Date.now()}`,
      email,
      password: data.password,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    const nextUsers = [...users, nextUser];
    window.localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(nextUsers));
    setUser(nextUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem(DEMO_SESSION_KEY);
  };

  const updateProfile = (data: { firstName?: string; lastName?: string; phone?: string; country?: string }) => {
    if (!user) return;

    const nextUser: AuthUser = {
      ...user,
      firstName: data.firstName ?? user.firstName,
      lastName: data.lastName ?? user.lastName,
      phone: data.phone ?? user.phone,
      country: data.country ?? user.country,
    };

    setUser(nextUser);

    const users = safeParseUsers();
    const nextUsers = users.map((entry) => (entry.id === user.id ? nextUser : entry));
    window.localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(nextUsers));
  };

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAuthReady,
    login,
    signup,
    logout,
    updateProfile,
  }), [user, isAuthReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
