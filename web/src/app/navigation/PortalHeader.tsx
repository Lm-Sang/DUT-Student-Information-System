import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { paths } from '@/shared/config/routes';
import { Icon } from '@/shared/ui/Icon';
import { BrandLockup } from '@/shared/ui/BrandLockup';
import { AccountMenu } from './AccountMenu';
import { NavigationMenu } from './NavigationMenu';
import { adminNavigation, studentNavigation, staffNavigation } from './navigation';

export function PortalHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const student = user?.role === 'student';
  useEffect(() => {
    const shortcut = (e: KeyboardEvent) => {
      if (student && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && !e.altKey) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    document.addEventListener('keydown', shortcut);
    return () => document.removeEventListener('keydown', shortcut);
  }, [student]);
  return (
    <header className="workspace-header">
      <div className="page-shell workspace-header-top">
        <button
          type="button"
          className="icon-button workspace-menu-trigger"
          aria-label="Mở điều hướng"
          onClick={onOpenMenu}
        >
          <Icon name="menu" />
        </button>
        <div className="workspace-desktop-brand">
          <BrandLockup
            to={
              student ? paths.dashboard : user?.role === 'staff' ? paths.staffRequests : paths.admin
            }
          />
        </div>
        <Link
          to={
            student ? paths.dashboard : user?.role === 'staff' ? paths.staffRequests : paths.admin
          }
          className="workspace-mobile-brand"
        >
          DUT <span>Portal</span>
        </Link>
        {student && (
          <form
            role="search"
            className="workspace-search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(
                paths.courses + (query.trim() ? '?q=' + encodeURIComponent(query.trim()) : ''),
              );
            }}
          >
            <button type="submit" aria-label="Tìm học phần" className="icon-button">
              <Icon name="search" />
            </button>
            <input
              ref={input}
              type="search"
              name="q"
              aria-label="Tìm học phần"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm tên hoặc mã học phần…"
              autoComplete="off"
            />
            <kbd aria-hidden="true">Ctrl K</kbd>
          </form>
        )}
        <div className="workspace-header-actions">
          {student && (
            <Link to={paths.notifications} aria-label="Thông báo" className="icon-button">
              <Icon name="bell" />
            </Link>
          )}
          <span className="header-divider" />
          <AccountMenu />
        </div>
      </div>
      <nav aria-label="Điều hướng chính" className="page-shell workspace-header-nav">
        {(student
          ? studentNavigation
          : user?.role === 'staff'
            ? staffNavigation
            : adminNavigation
        ).map((item) => (
          <NavigationMenu key={item.label} item={item} />
        ))}
      </nav>
    </header>
  );
}
