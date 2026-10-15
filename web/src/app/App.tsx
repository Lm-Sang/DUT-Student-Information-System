import { AppRoutes } from './router/AppRoutes';
import { usePortalEdition } from '@/shared/config/portalEdition';
import { VersionLink } from '@/shared/ui/VersionLink';
export default function App() {
  const edition = usePortalEdition();
  return (
    <>
      <AppRoutes />
      {edition === 'v1' && <VersionLink className="portal-version-link--floating" />}
    </>
  );
}
