import { useId, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { NavigationItem } from './navigation';
import { useNavigationMenu } from './useNavigationMenu';

const baseClass =
  'top-nav-link inline-flex min-h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium';
const activeClass = 'bg-selected text-brand font-semibold hover:bg-selected';
const inactiveClass = 'text-muted hover:bg-subtle hover:text-brand';

export function NavigationMenu({ item }: { item: NavigationItem }) {
  const { open, setOpen, containerRef, triggerRef, onKeyDown } = useNavigationMenu();
  const id = useId();
  const { pathname } = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 });

  useLayoutEffect(() => {
    if (!open) return;
    const updatePosition = () => {
      if (window.innerWidth < 1100) {
        setOpen(false);
        return;
      }
      const trigger = triggerRef.current?.getBoundingClientRect();
      if (!trigger) return;
      const width = menuRef.current?.offsetWidth ?? 320;
      setMenuPosition({
        left: Math.max(12, Math.min(trigger.left, window.innerWidth - width - 12)),
        top: trigger.bottom,
      });
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, triggerRef, setOpen]);

  if (item.to)
    return (
      <NavLink
        to={item.to}
        className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}
      >
        {item.label}
      </NavLink>
    );
  const active = item.children?.some((child) => child.to && pathname.startsWith(child.to));
  return (
    <div
      ref={containerRef}
      className="shrink-0"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={onKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className={`${baseClass} ${active ? activeClass : inactiveClass}`}
      >
        {item.label}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          className={`size-3 opacity-70 transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
        >
          <path
            d="m4 6 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div
          id={id}
          ref={menuRef}
          style={{ left: menuPosition.left, top: menuPosition.top }}
          className="fixed z-50 w-[min(20rem,calc(100vw-1.5rem))] pt-2"
        >
          <ul
            aria-label={item.label}
            className="nav-dropdown-panel max-h-[calc(100dvh-12rem)] overflow-y-auto rounded-2xl border border-line bg-surface p-2 shadow-[0_16px_36px_rgba(19,27,46,0.14),0_3px_10px_rgba(0,82,204,0.06)]"
          >
            {item.children?.map((child) => (
              <li key={child.label}>
                {child.to ? (
                  <NavLink
                    to={child.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex min-h-11 items-center rounded-xl px-3.5 py-2.5 text-[0.8125rem] leading-snug transition-colors duration-150 motion-reduce:transition-none ${isActive ? 'bg-subtle font-semibold text-brand' : 'text-ink hover:translate-x-0.5 hover:bg-canvas hover:text-brand motion-reduce:hover:translate-x-0'}`
                    }
                  >
                    {child.label}
                  </NavLink>
                ) : (
                  <span
                    aria-disabled="true"
                    className="block rounded-xl px-3.5 py-2.5 text-[0.8125rem] text-muted"
                  >
                    {child.label}
                    <span className="mt-1 block text-xs">Chưa có chức năng trong ứng dụng</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
