import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { paths } from '@/shared/config/routes';
import type { NavigationItem } from './navigation';

function positionPanel(anchor: HTMLElement, panel: HTMLElement, centered = false) {
  const bounds = anchor.getBoundingClientRect();
  const left = Math.min(bounds.right + 12, window.innerWidth - panel.offsetWidth - 8);
  const top = centered ? bounds.top + (bounds.height - panel.offsetHeight) / 2 : bounds.top;
  panel.style.left = `${Math.max(8, left)}px`;
  panel.style.top = `${Math.max(8, Math.min(top, window.innerHeight - panel.offsetHeight - 8))}px`;
}

export function SidebarRailItem({
  item,
  icon,
  onNavigate,
  mobileBreakpoint = 1099,
}: {
  item: NavigationItem;
  icon: ReactNode;
  onNavigate?: () => void;
  mobileBreakpoint?: number;
}) {
  const { pathname } = useLocation();
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const tooltip = useRef<HTMLSpanElement>(null);
  const [labelAnchor, setLabelAnchor] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const labelTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const clearLabelTimer = () => clearTimeout(labelTimer.current);
  const hideLabel = () => {
    clearLabelTimer();
    setLabelAnchor(null);
  };
  const delayHideLabel = () => {
    clearLabelTimer();
    labelTimer.current = setTimeout(() => setLabelAnchor(null), 150);
  };
  useEffect(() => () => clearTimeout(labelTimer.current), []);
  const active = item.children?.some((child) => child.to && pathname.startsWith(child.to)) ?? false;

  useLayoutEffect(() => {
    if (labelAnchor && tooltip.current) positionPanel(labelAnchor, tooltip.current, true);
  }, [labelAnchor]);

  useEffect(() => {
    if (!open && !labelAnchor) return;
    const reposition = () => {
      if (window.innerWidth <= mobileBreakpoint) {
        panel.current?.hidePopover();
        setLabelAnchor(null);
        return;
      }
      if (open && trigger.current && panel.current) positionPanel(trigger.current, panel.current);
      if (labelAnchor && tooltip.current) positionPanel(labelAnchor, tooltip.current, true);
    };
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [labelAnchor, open, mobileBreakpoint]);

  const labelEvents = {
    onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
      clearLabelTimer();
      const anchor = event.currentTarget;
      labelTimer.current = setTimeout(() => setLabelAnchor(anchor), 400);
    },
    onMouseLeave: delayHideLabel,
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      clearLabelTimer();
      setLabelAnchor(event.currentTarget);
    },
    onBlur: hideLabel,
    'aria-describedby': labelAnchor && !open ? `${id}-label` : undefined,
  };

  return (
    <div
      className="sidebar-rail-item"
      onKeyDown={(event) => {
        if (event.key === 'Escape') hideLabel();
      }}
    >
      {item.to ? (
        <NavLink
          to={item.to}
          end={item.to === paths.dashboard}
          aria-label={item.label}
          className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}
          {...labelEvents}
          onClick={() => {
            setLabelAnchor(null);
            onNavigate?.();
          }}
        >
          {icon}
        </NavLink>
      ) : (
        <>
          <button
            ref={trigger}
            type="button"
            aria-label={item.label}
            aria-expanded={open}
            aria-controls={id}
            popoverTarget={id}
            className={`sidebar-link sidebar-group-trigger ${active ? 'is-current-group' : ''} ${open ? 'is-open' : ''}`}
            {...labelEvents}
            onClick={() => setLabelAnchor(null)}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowDown') return;
              event.preventDefault();
              setLabelAnchor(null);
              panel.current?.showPopover();
              requestAnimationFrame(() =>
                panel.current?.querySelector<HTMLAnchorElement>('a')?.focus(),
              );
            }}
          >
            {icon}
            <span className="sidebar-rail-group-dot" aria-hidden="true" />
          </button>
          <div
            id={id}
            ref={panel}
            popover="auto"
            className="sidebar-flyout"
            role="region"
            aria-label={item.label}
            onBeforeToggle={(event) => {
              if (event.newState !== 'open' || !trigger.current) return;
              const anchor = trigger.current;
              const floating = event.currentTarget;
              floating.style.opacity = '0';
              requestAnimationFrame(() => {
                if (!floating.matches(':popover-open')) return;
                positionPanel(anchor, floating);
                floating.style.opacity = '1';
              });
            }}
            onToggle={(event) => {
              const visible = event.newState === 'open';
              setOpen(visible);
              if (visible && trigger.current) {
                positionPanel(trigger.current, event.currentTarget);
                event.currentTarget.style.opacity = '1';
              }
            }}
            onBlur={(event) => {
              if (
                !event.currentTarget.contains(event.relatedTarget) &&
                event.relatedTarget !== trigger.current
              )
                event.currentTarget.hidePopover();
            }}
          >
            <p className="sidebar-flyout-title">{item.label}</p>
            {item.children
              ?.filter((child) => child.to)
              .map((child) => (
                <NavLink
                  key={child.label}
                  to={child.to!}
                  end={child.to === paths.grades}
                  className={({ isActive }) => `sidebar-sublink ${isActive ? 'is-active' : ''}`}
                  onClick={() => {
                    panel.current?.hidePopover();
                    onNavigate?.();
                  }}
                >
                  {child.label}
                </NavLink>
              ))}
          </div>
        </>
      )}
      {labelAnchor &&
        !open &&
        createPortal(
          <span
            ref={tooltip}
            id={`${id}-label`}
            role="tooltip"
            className="sidebar-tooltip"
            onMouseEnter={clearLabelTimer}
            onMouseLeave={delayHideLabel}
          >
            {item.label}
          </span>,
          labelAnchor.closest('[data-portal-version]') ?? document.body,
        )}
    </div>
  );
}
