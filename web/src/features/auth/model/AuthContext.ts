import { createContext } from 'react';
import type { User, UserRole } from '../types';
export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
