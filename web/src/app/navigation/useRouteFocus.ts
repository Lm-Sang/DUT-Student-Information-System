import { useEffect, useRef, type RefObject } from 'react';

/** Announce a new workspace page without moving focus on filters or query tabs. */
export function useRouteFocus(pathname: string, main: RefObject<HTMLElement | null>) {
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const active = document.activeElement;
    // Ctrl/Cmd K can run while the router is committing the next page.
    if (
      active instanceof HTMLElement &&
      active.matches('input[type="search"]') &&
      !main.current?.contains(active)
    )
      return;
    main.current?.focus({ preventScroll: true });
  }, [pathname, main]);
}
