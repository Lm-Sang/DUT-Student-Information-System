import { useContext } from 'react';
import { AuthContext } from '../model/AuthContext';
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
