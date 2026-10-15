import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { UserRole } from '../types';
import { useAuth } from '../hooks/useAuth';
import { paths } from '@/shared/config/routes';
export function ProtectedRoute({ children, role }: { children?: ReactNode; role?: UserRole }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user)
    return (
      <Navigate to={paths.login} replace state={{ from: location.pathname + location.search }} />
    );
  if (role && user.role !== role)
    return (
      <Navigate
        to={
          user.role === 'admin'
            ? paths.admin
            : user.role === 'staff'
              ? paths.staffRequests
              : paths.dashboard
        }
        replace
      />
    );
  return children ?? <Outlet />;
}
