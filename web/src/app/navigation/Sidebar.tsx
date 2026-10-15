import { NavLink, useLocation } from 'react-router-dom';
import { useId, useState } from 'react';
import { useAuth } from '@/features/auth';
import { paths } from '@/shared/config/routes';
import { Icon, type IconName } from '@/shared/ui/Icon';
import {
  studentNavigation,
  adminNavigation,
  staffNavigation,
  type NavigationItem,
} from './navigation';
import { SidebarRailItem } from './SidebarRailItem';

const icons: Record<string, IconName> = {
  'Trang chủ': 'home',
  'Chương trình đào tạo': 'book',
  'Lịch học & Lịch thi': 'calendar',
  'Kết quả học tập': 'chart',
  'Học phí': 'wallet',
  'Rèn luyện & Đoàn hội': 'users',
  'Dịch vụ': 'file',
  'Quản trị hệ thống': 'chart',
};

function SidebarItem({ item, onNavigate }: { item: NavigationItem; onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const active = item.children?.some((child) => child.to && pathname.startsWith(child.to)) ?? false;
  const [expanded, setExpanded] = useState(active);
  const panelId = useId();
  if (item.to)
    return (
      <NavLink
        to={item.to}
        end={item.to === paths.dashboard}
        onClick={onNavigate}
        className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}
      >
        <Icon name={icons[item.label] ?? 'file'} />
        <span>{item.label}</span>
      </NavLink>
    );
  return (
    <div className="sidebar-group">
      <button
        type="button"
        className={`sidebar-link sidebar-group-trigger ${active ? 'is-current-group' : ''}`}
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded(!expanded)}
      >
        <Icon name={icons[item.label] ?? 'file'} />
        <span>{item.label}</span>
        <Icon name="chevron" className={`sidebar-chevron ${expanded ? 'is-expanded' : ''}`} />
      </button>
      <div id={panelId} hidden={!expanded} className="sidebar-children">
        {item.children
          ?.filter((child) => child.to)
          .map((child) =>
            child.to ? (
              <NavLink
                key={child.label}
                to={child.to}
                end={child.to === paths.grades}
                onClick={onNavigate}
                className={({ isActive }) => `sidebar-sublink ${isActive ? 'is-active' : ''}`}
              >
                {child.label}
              </NavLink>
            ) : (
              <span key={child.label} className="sidebar-unavailable" aria-disabled="true">
                {child.label}
                <small>Chưa khả dụng</small>
              </span>
            ),
          )}
      </div>
    </div>
  );
}

export function Sidebar({
  onNavigate,
  collapsed = false,
  onToggle,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navId = useId();
  return (
    <div className={`sidebar-content ${collapsed ? 'sidebar-content--collapsed' : ''}`}>
      {onToggle && (
        <div className="sidebar-controls">
          <button
            type="button"
            className="sidebar-toggle"
            onClick={onToggle}
            aria-label={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
            title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
            aria-expanded={!collapsed}
            aria-controls={navId}
          >
            <Icon name="chevron" className={`!size-[18px] ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>
      )}
      <NavLink
        to={
          user?.role === 'admin'
            ? paths.admin
            : user?.role === 'staff'
              ? paths.staffRequests
              : paths.dashboard
        }
        className="sidebar-brand"
        aria-label="Student Portal – Trang chủ"
        onClick={onNavigate}
      >
        <span className="dut-monogram" aria-hidden="true">
          DUT
        </span>
        <span className={collapsed ? 'sr-only' : undefined}>
          <strong>Student Portal</strong>
          <small>Đại học Bách khoa Đà Nẵng</small>
        </span>
      </NavLink>
      <div className="sidebar-context" hidden={collapsed}>
        <span className="semester-dot" />
        <span>
          Học kỳ I <strong>2026–2027</strong>
        </span>
      </div>
      <nav id={navId} aria-label="Điều hướng chính" className="sidebar-navigation">
        {(user?.role === 'student'
          ? studentNavigation
          : user?.role === 'staff'
            ? staffNavigation
            : adminNavigation
        ).map((item) =>
          collapsed ? (
            <SidebarRailItem
              key={`${item.label}-${pathname}`}
              item={item}
              icon={<Icon name={icons[item.label] ?? 'file'} className="!size-[22px]" />}
              onNavigate={onNavigate}
            />
          ) : (
            <SidebarItem key={`${item.label}-${pathname}`} item={item} onNavigate={onNavigate} />
          ),
        )}
      </nav>
      <div className="sidebar-bottom">
        {collapsed ? (
          <a
            href="mailto:tchc@dut.udn.vn"
            className="sidebar-support-icon"
            aria-label="Liên hệ nhà trường"
            title="Liên hệ nhà trường"
          >
            <Icon name="info" className="!size-[22px]" />
          </a>
        ) : (
          <>
            <Icon name="info" />
            <div>
              <strong>Cần hỗ trợ?</strong>
              <a href="mailto:tchc@dut.udn.vn">Liên hệ nhà trường</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
