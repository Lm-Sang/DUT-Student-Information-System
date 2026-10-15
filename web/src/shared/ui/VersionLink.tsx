import { useLocation } from 'react-router-dom';
import { counterpartUrl, usePortalEdition } from '../config/portalEdition';

export function VersionLink({ className = '' }: { className?: string }) {
  const edition = usePortalEdition();
  const { pathname, search, hash } = useLocation();
  return (
    <a
      href={counterpartUrl(edition, pathname, search, hash)}
      target="_blank"
      rel="noreferrer"
      className={`portal-version-link ${className}`}
    >
      {edition === 'v1' ? 'Xem giao diện V2 ↗' : 'Xem giao diện V1 ↗'}
    </a>
  );
}
