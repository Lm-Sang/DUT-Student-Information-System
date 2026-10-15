import { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { paths } from '@/shared/config/routes';
import profileImage from '@/shared/assets/figma/profile.png';
import v2Avatar from '@/shared/assets/figma-v2/0945e.png';
import { usePortalEdition } from '@/shared/config/portalEdition';

type IconName = 'schedule' | 'grades' | 'tuition' | 'notifications' | 'support' | 'logout';

function MenuIcon({ name }: { name: IconName }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="size-5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === 'schedule' && (
        <>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M7 3v4m10-4v4M3 10h18m-13 4h3m-3 3h6" />
        </>
      )}
      {name === 'grades' && (
        <>
          <path d="M4 20V10m5 10V4m5 16v-7m5 7V8" />
          <path d="M2 20h20" />
        </>
      )}
      {name === 'tuition' && (
        <>
          <rect x="3" y="5" width="18" height="15" rx="2" />
          <path d="M3 9h18m-5 6h2" />
        </>
      )}
      {name === 'notifications' && (
        <>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />
        </>
      )}
      {name === 'support' && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-1.1 1-1.7 1.4-1.7 2.7m0 3h.01" />
        </>
      )}
      {name === 'logout' && (
        <>
          <path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4m4-4 4-4-4-4m-7 4h11" />
        </>
      )}
    </svg>
  );
}

const studentLinks: { label: string; to: string; icon: IconName }[] = [
  { label: 'Lịch học & lịch thi', to: paths.schedule, icon: 'schedule' },
  { label: 'Kết quả học tập', to: paths.grades, icon: 'grades' },
  { label: 'Học phí', to: paths.tuition, icon: 'tuition' },
  { label: 'Thông báo của tôi', to: paths.notifications, icon: 'notifications' },
  { label: 'Yêu cầu hỗ trợ', to: paths.serviceRequests, icon: 'support' },
];

export function AccountMenu() {
  const avatarImage = usePortalEdition() === 'v2' ? v2Avatar : profileImage;
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const student = user?.role === 'student';
  const open = openPath === pathname;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpenPath(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenPath(null);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpenPath(null);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label="Menu tài khoản"
        aria-expanded={open}
        aria-controls={panelId}
        className={`flex items-center gap-2 rounded-full py-1 pl-3 pr-1 text-right transition-colors ${open ? 'bg-subtle text-brand' : 'hover:bg-canvas'}`}
        onClick={() => setOpenPath((current) => (current === pathname ? null : pathname))}
      >
        <span className="hidden sm:block">
          <span className="block max-w-40 truncate text-xs font-semibold">{user?.fullName}</span>
          <span className="block max-w-40 truncate text-xs text-muted">
            {student
              ? `${user?.studentId ?? user?.username} · ${user?.className ?? 'Sinh viên'}`
              : user?.role === 'staff'
                ? 'Chuyên viên'
                : 'Quản trị viên'}
          </span>
        </span>
        <span className="relative shrink-0">
          <img src={avatarImage} alt="" className="size-8 rounded-full object-cover" />
          <span className="absolute -bottom-0.5 -right-0.5 grid size-3.5 place-items-center rounded-full border border-white bg-line text-ink">
            <svg
              aria-hidden="true"
              viewBox="0 0 12 12"
              fill="none"
              className={`size-2.5 transition-transform ${open ? 'rotate-180' : ''}`}
            >
              <path
                d="m2.5 4.5 3.5 3 3.5-3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </span>
      </button>

      {open && (
        <div
          id={panelId}
          className="nav-dropdown-panel absolute right-0 top-full z-50 mt-2 max-h-[calc(100dvh-5rem)] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-line/80 bg-surface p-3 shadow-[0_18px_45px_rgba(19,27,46,0.18),0_3px_10px_rgba(19,27,46,0.07)] sm:p-4"
        >
          <div className="border-b border-line pb-3">
            <div className="flex items-center gap-3 p-2">
              <img
                src={avatarImage}
                alt=""
                className="size-12 shrink-0 rounded-full object-cover ring-2 ring-line"
              />
              <div className="min-w-0">
                <p className="truncate text-[0.9375rem] font-bold text-ink">{user?.fullName}</p>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {student
                    ? `MSSV ${user?.studentId ?? user?.username} · Lớp ${user?.className ?? '—'}`
                    : user?.role === 'staff'
                      ? 'Chuyên viên'
                      : 'Quản trị viên'}
                </p>
              </div>
            </div>
            <Link
              to={
                student ? paths.profile : user?.role === 'staff' ? paths.staffRequests : paths.admin
              }
              onClick={() => setOpenPath(null)}
              className="mt-2 flex min-h-10 items-center justify-center rounded-xl bg-subtle px-3 text-xs font-semibold text-brand hover:bg-subtle"
            >
              {student
                ? 'Xem hồ sơ sinh viên'
                : user?.role === 'staff'
                  ? 'Đến trang xử lý hồ sơ'
                  : 'Đến trang quản trị'}
            </Link>
          </div>

          <nav aria-label="Menu tài khoản" className="mt-3">
            {student &&
              studentLinks.map(({ label, to, icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpenPath(null)}
                  className="group flex min-h-12 items-center gap-3 rounded-xl px-2 py-1.5 text-[0.8125rem] font-medium text-ink hover:bg-canvas hover:text-brand"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg text-muted group-hover:text-brand">
                    <MenuIcon name={icon} />
                  </span>
                  <span className="flex-1">{label}</span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="size-4 text-muted"
                  >
                    <path
                      d="m6 3 5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              ))}
          </nav>
          <div className="mt-2 border-t border-line pt-2">
            <button
              type="button"
              onClick={() => {
                setOpenPath(null);
                logout();
                navigate(paths.login, { replace: true });
              }}
              className="group flex min-h-12 w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left text-[0.8125rem] font-medium text-ink hover:bg-danger-soft hover:text-danger"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-subtle text-muted group-hover:bg-danger-soft group-hover:text-danger">
                <MenuIcon name="logout" />
              </span>
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
