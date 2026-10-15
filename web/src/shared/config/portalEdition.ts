import { createContext, useContext } from 'react';

export type PortalEdition = 'v1' | 'v2';
export const PortalEditionContext = createContext<PortalEdition>('v1');

export function editionFromPath(pathname: string): PortalEdition {
  return pathname === '/v2' || pathname.startsWith('/v2/') ? 'v2' : 'v1';
}

export function usePortalEdition() {
  return useContext(PortalEditionContext);
}

/** The pathname here is local to the router (without its /v2 basename). */
export function counterpartUrl(edition: PortalEdition, pathname: string, search = '', hash = '') {
  return `${edition === 'v1' ? '/v2' : ''}${pathname}${search}${hash}`;
}
