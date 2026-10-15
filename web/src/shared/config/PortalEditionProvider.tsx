import type { ReactNode } from 'react';
import { PortalEditionContext, type PortalEdition } from './portalEdition';

export function PortalEditionProvider({
  edition,
  children,
}: {
  edition: PortalEdition;
  children: ReactNode;
}) {
  return <PortalEditionContext.Provider value={edition}>{children}</PortalEditionContext.Provider>;
}
