import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { AuthContext } from '../model/AuthContext';
import type { User, UserRole } from '../types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const session = useRef(0);
  const login = useCallback(async (username: string, password: string) => {
    const version = ++session.current;
    setLoading(true);
    try {
      const nextUser = await authService.login(username, password);
      if (version === session.current) setUser(nextUser);
    } finally {
      if (version === session.current) setLoading(false);
    }
  }, []);
  const logout = useCallback(() => {
    session.current++;
    setUser(null);
    setLoading(false);
  }, []);
  const hasRole = useCallback((role: UserRole) => user?.role === role, [user]);
  const value = useMemo(
    () => ({ user, loading, login, logout, hasRole }),
    [user, loading, login, logout, hasRole],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
