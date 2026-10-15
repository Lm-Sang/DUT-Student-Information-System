import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export function useNavigationMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target))
        setOpen(false);
    };
    document.addEventListener('pointerdown', onOutside);
    return () => document.removeEventListener('pointerdown', onOutside);
  }, [open]);
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
    if (event.key === 'ArrowDown' && event.target === triggerRef.current) {
      event.preventDefault();
      setOpen(true);
      requestAnimationFrame(() =>
        containerRef.current?.querySelector<HTMLAnchorElement>('a')?.focus(),
      );
    }
  }
  return { open, setOpen, containerRef, triggerRef, onKeyDown };
}
