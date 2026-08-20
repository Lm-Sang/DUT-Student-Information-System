import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { login as loginService } from '../services/authService';
import type { User, UserRole } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const value = useMemo(
    () => ({
      user,
      loading,
      login: async (username: string, password: string) => {
        setLoading(true);
        try {
          const loggedInUser = await loginService(username, password);
          setUser(loggedInUser);
        } finally {
          setLoading(false);
        }
      },
      logout: () => setUser(null),
      hasRole: (role: UserRole) => user?.role === role,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
