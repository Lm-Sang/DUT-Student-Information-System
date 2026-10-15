import { useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Breadcrumbs } from '../navigation/Breadcrumbs';
import { useRouteFocus } from '../navigation/useRouteFocus';
import { InstitutionalFooter } from '@/shared/ui/InstitutionalFooter';
import { PortalHeader } from '../navigation/PortalHeader';
import { Sidebar } from '../navigation/Sidebar';
import { Dialog } from '@/shared/ui/Dialog';
export function PortalLayout() {
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  useRouteFocus(pathname, main);
  const [menuPath, setMenuPath] = useState<string | null>(null);
  return (
    <div className="workspace">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-action focus:p-3 focus:text-white"
      >
        Chuyển đến nội dung chính
      </a>
      {menuPath === pathname && (
        <Dialog title="Điều hướng" variant="drawer" onClose={() => setMenuPath(null)}>
          <Sidebar onNavigate={() => setMenuPath(null)} />
        </Dialog>
      )}
      <div className="workspace-body">
        <PortalHeader onOpenMenu={() => setMenuPath(pathname)} />
        <div className="workspace-breadcrumb page-shell">
          <Breadcrumbs />
        </div>
        <main
          ref={main}
          id="main-content"
          tabIndex={-1}
          className="page-shell workspace-main flex-1 py-6 sm:py-8"
        >
          <div key={pathname} className="page-enter w-full">
            <Outlet />
          </div>
        </main>
        <InstitutionalFooter />
      </div>
    </div>
  );
}
