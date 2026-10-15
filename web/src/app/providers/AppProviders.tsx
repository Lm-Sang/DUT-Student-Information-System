import { BrowserRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/features/auth';
import { editionFromPath } from '@/shared/config/portalEdition';
import { PortalEditionProvider } from '@/shared/config/PortalEditionProvider';

// A full document navigation switches edition. Each router keeps all existing
// Link/Navigate destinations within its own basename, including deep links.
const edition = editionFromPath(window.location.pathname);

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter basename={edition === 'v2' ? '/v2' : '/'}>
      <PortalEditionProvider edition={edition}>
        <AuthProvider>
          <div className={`portal-${edition}`} data-portal-version={edition}>
            {children}
          </div>
        </AuthProvider>
      </PortalEditionProvider>
    </BrowserRouter>
  );
}
