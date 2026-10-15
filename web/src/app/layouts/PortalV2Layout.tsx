import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useNavigationType,
} from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { NotificationsPage } from '@/features/notifications';
import { paths } from '@/shared/config/routes';
import { Icon } from '@/shared/ui/Icon';
import { V2Icon, type V2IconName } from '@/shared/ui/V2Icon';
import { VersionLink } from '@/shared/ui/VersionLink';
import { Dialog } from '@/shared/ui/Dialog';
import { InstitutionalFooter } from '@/shared/ui/InstitutionalFooter';
import avatar from '@/shared/assets/figma-v2/0010c.png';
import logo from '@/shared/assets/dut-logo.png';
import { AccountMenu } from '../navigation/AccountMenu';
import { SidebarRailItem } from '../navigation/SidebarRailItem';
import { Breadcrumbs } from '../navigation/Breadcrumbs';
import { useRouteFocus } from '../navigation/useRouteFocus';

const navigation: {
  label: string;
  to: string;
  icon: V2IconName;
  children?: { label: string; to: string }[];
}[] = [
  { label: 'Tổng quan', to: paths.dashboard, icon: 'home' },
  {
    label: 'Chương trình đào tạo',
    to: paths.courses,
    icon: 'book',
    children: [
      { label: 'Học phần', to: paths.courses },
      { label: 'Đăng ký học phần', to: paths.registration },
    ],
  },
  { label: 'Lịch học & lịch thi', to: paths.schedule, icon: 'calendar' },
  {
    label: 'Kết quả học tập',
    to: paths.grades,
    icon: 'chart',
    children: [
      { label: 'Tổng quan toàn khóa', to: paths.grades },
      { label: 'Điểm học kỳ hiện tại', to: paths.gradesCurrent },
      { label: 'Học vụ', to: paths.gradesStanding },
      { label: 'Điểm PLO', to: paths.gradesPlo },
    ],
  },
  { label: 'Đồ án & tốt nghiệp', to: paths.thesis, icon: 'file' },
  { label: 'Học phí', to: paths.tuition, icon: 'wallet' },
  { label: 'Rèn luyện & Đoàn hội', to: paths.conductSelf, icon: 'users' },
  { label: 'Dịch vụ sinh viên', to: paths.serviceRequests, icon: 'file' },
];
const conductLinks = [
  ['Tự đánh giá', paths.conductSelf],
  ['Đánh giá của lớp', paths.conductClass],
  ['Hoạt động cộng đồng', paths.communityActivities],
  ['Kết quả cộng đồng', paths.communityResults],
];

function V2NavigationItem({
  item,
  onNavigate,
}: {
  item: (typeof navigation)[number];
  onNavigate?: () => void;
}) {
  const { pathname } = useLocation();
  const children =
    item.to === paths.conductSelf
      ? conductLinks.map(([label, to]) => ({ label, to }))
      : item.children;
  const active = pathname.startsWith(item.to) || children?.some((c) => pathname.startsWith(c.to));
  const [expanded, setExpanded] = useState(Boolean(active));
  const [expandedPath, setExpandedPath] = useState(pathname);
  const showChildren = expandedPath === pathname ? expanded : Boolean(active);
  const id = useId();
  return (
    <div>
      <div className="v2-nav-heading">
        <NavLink
          to={item.to}
          end={item.to === paths.dashboard || item.to === paths.grades}
          onClick={onNavigate}
          className={active ? 'is-active' : ''}
        >
          <V2Icon name={item.icon} />
          <span>{item.label}</span>
        </NavLink>
        {children && (
          <button
            type="button"
            className="v2-group-toggle"
            aria-label={`Mục con ${item.label}`}
            aria-expanded={showChildren}
            aria-controls={id}
            onClick={() => {
              setExpanded(!showChildren);
              setExpandedPath(pathname);
            }}
          >
            <Icon name="chevron" className={showChildren ? 'rotate-90' : ''} />
          </button>
        )}
      </div>
      {children && (
        <div id={id} hidden={!showChildren} className="v2-subnav">
          {children.map((c) => (
            <NavLink key={c.to} to={c.to} end onClick={onNavigate}>
              {c.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function V2Sidebar({
  onNavigate,
  collapsed = false,
  onToggle,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  const { user } = useAuth();
  const navId = useId();
  return (
    <div className={`v2-sidebar-inner ${collapsed ? 'v2-sidebar-inner--collapsed' : ''}`}>
      <div className="v2-sidebar-heading">
        <Link
          to={
            user?.role === 'admin'
              ? paths.admin
              : user?.role === 'staff'
                ? paths.staffRequests
                : paths.dashboard
          }
          className="v2-brand"
          aria-label="DUT – Cổng thông tin sinh viên"
          onClick={onNavigate}
        >
          <span className="v2-brand-mark">
            <img src={logo} width="40" height="40" alt="" />
            {!collapsed && <strong>DUT</strong>}
          </span>
          <span className={collapsed ? 'sr-only' : ''}>Cổng thông tin sinh viên</span>
        </Link>
        {onToggle && (
          <button
            type="button"
            className="v2-sidebar-toggle"
            onClick={onToggle}
            aria-label={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
            title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
            aria-expanded={!collapsed}
            aria-controls={navId}
          >
            <Icon name="chevron" className={collapsed ? '' : 'rotate-180'} />
          </button>
        )}
      </div>
      <nav id={navId} aria-label="Điều hướng chính" className="v2-nav">
        {user?.role !== 'student' ? (
          <>
            {user?.role === 'admin' && (
              <NavLink to={paths.admin} end onClick={onNavigate} title="Quản trị hệ thống">
                <V2Icon name="chart" />
                <span className={collapsed ? 'sr-only' : ''}>Quản trị hệ thống</span>
              </NavLink>
            )}
            <NavLink
              to={user?.role === 'admin' ? paths.adminRequests : paths.staffRequests}
              onClick={onNavigate}
              title={user?.role === 'admin' ? 'Điều phối hồ sơ' : 'Hồ sơ được phân công'}
            >
              <V2Icon name="book" />
              <span className={collapsed ? 'sr-only' : ''}>
                {user?.role === 'admin' ? 'Điều phối hồ sơ' : 'Hồ sơ được phân công'}
              </span>
            </NavLink>
          </>
        ) : (
          navigation.map((item) =>
            collapsed ? (
              <SidebarRailItem
                key={item.to}
                item={
                  item.to === paths.conductSelf
                    ? {
                        label: item.label,
                        children: conductLinks.map(([label, to]) => ({ label, to })),
                      }
                    : item.children
                      ? { label: item.label, children: item.children }
                      : item
                }
                icon={<V2Icon name={item.icon} />}
                onNavigate={onNavigate}
                mobileBreakpoint={900}
              />
            ) : (
              <V2NavigationItem key={item.to} item={item} onNavigate={onNavigate} />
            ),
          )
        )}
      </nav>
      <div className="v2-sidebar-bottom">
        {user?.role === 'student' && (
          <Link to={paths.registration} className="v2-registration" onClick={onNavigate}>
            <V2Icon name="book" />
            <span className={collapsed ? 'sr-only' : ''}>Đăng ký học phần</span>
          </Link>
        )}
        <Link
          to={
            user?.role === 'admin'
              ? paths.adminRequests
              : user?.role === 'staff'
                ? paths.staffRequests
                : paths.serviceRequests
          }
          className="v2-support"
          onClick={onNavigate}
          title={collapsed ? 'Cần hỗ trợ? Bộ phận một cửa' : undefined}
        >
          {collapsed && <Icon name="info" />}
          <strong className={collapsed ? 'sr-only' : ''}>Cần hỗ trợ?</strong>
          <span className={collapsed ? 'sr-only' : ''}>Bộ phận một cửa</span>
        </Link>
        <Link
          to={
            user?.role === 'admin'
              ? paths.admin
              : user?.role === 'staff'
                ? paths.staffRequests
                : paths.profile
          }
          className="v2-identity"
          onClick={onNavigate}
          title={collapsed ? user?.fullName : undefined}
        >
          <img src={avatar} width="36" height="36" alt="" />
          <span className={collapsed ? 'sr-only' : ''}>
            <strong>{user?.fullName}</strong>
            <small>
              {user?.studentId ?? user?.username} ·{' '}
              {user?.className ?? (user?.role === 'staff' ? 'Chuyên viên' : 'Quản trị viên')}
            </small>
          </span>
        </Link>
      </div>
    </div>
  );
}

export function PortalV2Layout() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [noticePath, setNoticePath] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('dut-v2-sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const toggleSidebar = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    try {
      localStorage.setItem('dut-v2-sidebar-collapsed', String(next));
    } catch {
      /* Keep the session preference when storage is unavailable. */
    }
  };
  const [query, setQuery] = useState('');
  const content = useRef<HTMLElement>(null);
  useRouteFocus(location.pathname, content);
  const searchInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (
        user?.role === 'student' &&
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'k' &&
        !event.altKey
      ) {
        event.preventDefault();
        searchInput.current?.focus();
      }
    };
    document.addEventListener('keydown', shortcut);
    return () => document.removeEventListener('keydown', shortcut);
  }, [user?.role]);
  useLayoutEffect(() => {
    if (!location.hash && navigationType !== 'POP')
      content.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname, location.search, location.hash, navigationType]);
  return (
    <div className="v2-workspace" data-sidebar-collapsed={sidebarCollapsed}>
      <a href="#main-content" className="v2-skip-link">
        Chuyển đến nội dung chính
      </a>
      <aside className="v2-sidebar">
        <V2Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </aside>
      <div className="v2-workspace-body">
        <header className="v2-toolbar">
          <button
            type="button"
            className="icon-button v2-menu-trigger"
            aria-label="Mở điều hướng"
            onClick={() => setMenuPath(location.pathname)}
          >
            <Icon name="menu" />
          </button>
          <Breadcrumbs />
          <VersionLink />
          {user?.role === 'student' && (
            <form
              role="search"
              className="v2-search"
              onSubmit={(event) => {
                event.preventDefault();
                navigate(
                  paths.courses + (query.trim() ? '?q=' + encodeURIComponent(query.trim()) : ''),
                );
              }}
            >
              <button type="submit" aria-label="Tìm học phần">
                <V2Icon name="search" />
              </button>
              <input
                ref={searchInput}
                aria-label="Tìm học phần"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm tên hoặc mã học phần…"
              />
            </form>
          )}
          {user?.role === 'student' && (
            <button
              type="button"
              className="v2-notification-button"
              aria-label="Thông báo"
              onClick={() => setNoticePath(location.pathname)}
            >
              <V2Icon name="bell" />
            </button>
          )}
          <AccountMenu />
        </header>
        <main
          ref={content}
          id="main-content"
          tabIndex={-1}
          className="v2-main"
          data-page={location.pathname}
        >
          <div key={location.pathname} className="v2-page">
            <Outlet />
          </div>
          <InstitutionalFooter />
        </main>
      </div>
      {menuPath === location.pathname && (
        <Dialog title="Điều hướng" variant="drawer" onClose={() => setMenuPath(null)}>
          <V2Sidebar onNavigate={() => setMenuPath(null)} />
        </Dialog>
      )}
      {noticePath === location.pathname && (
        <Dialog
          title="Thông báo mới"
          variant="drawer"
          side="right"
          onClose={() => setNoticePath(null)}
        >
          <NotificationsPage />
          <Link to={paths.notifications} className="v2-button" onClick={() => setNoticePath(null)}>
            Xem tất cả thông báo
          </Link>
        </Dialog>
      )}
    </div>
  );
}
