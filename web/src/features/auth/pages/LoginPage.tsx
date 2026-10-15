import { Link, Navigate, useLocation } from 'react-router-dom';
import { paths } from '@/shared/config/routes';
import { usePortalEdition } from '@/shared/config/portalEdition';
import { VersionLink } from '@/shared/ui/VersionLink';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';
import campusImage from '@/shared/assets/figma/public-campus.png';

export function LoginPage() {
  const v2 = usePortalEdition() === 'v2';
  const { user } = useAuth();
  const location = useLocation();
  const from: unknown = location.state?.from;
  if (user) {
    const safeFrom =
      typeof from === 'string' &&
      from.startsWith('/') &&
      !from.startsWith('//') &&
      from !== paths.login
        ? from
        : null;
    return (
      <Navigate
        to={
          safeFrom ??
          (user.role === 'admin'
            ? paths.admin
            : user.role === 'staff'
              ? paths.staffRequests
              : paths.dashboard)
        }
        replace
      />
    );
  }
  return (
    <main className="login-layout">
      <section className="login-story" aria-label="DUT Student Portal">
        <Link to={paths.home} className="flex items-center gap-3">
          <span className="rounded-lg border border-line px-3 py-2 font-bold">DUT</span>
          <span className="text-sm">
            Đại học Bách khoa
            <br />
            <span className="text-xs text-muted">Đại học Đà Nẵng</span>
          </span>
        </Link>
        <div>
          <h2>Hành trình học tập, trong tầm tay.</h2>
          <p>
            Theo dõi lịch học, kết quả và các dịch vụ sinh viên trong một không gian thống nhất.
          </p>
          <img
            src={campusImage}
            alt="Khuôn viên Trường Đại học Bách khoa Đà Nẵng"
            width="560"
            height="240"
          />
        </div>
        <p className="!text-xs">Cổng thông tin sinh viên DUT</p>
      </section>
      <section className="login-form-side">
        <div>
          <div className="flex items-center justify-between">
            <Link to={paths.home} className="text-sm font-medium text-brand">
              Về cổng thông tin
            </Link>
          </div>
          <h1>Đăng nhập</h1>
          {v2 && <VersionLink />}
          <p className="mt-3 text-muted">
            Sử dụng tài khoản sinh viên, chuyên viên hoặc quản trị viên.
          </p>
          <LoginForm />
          <div className="login-demo">
            <p className="mb-2 font-medium text-ink">Tài khoản trải nghiệm</p>
            <p>Sinh viên: student01–student12 / student123</p>
            <p className="mt-1">Chuyên viên: staff01–staff16 / staff123</p>
            <p className="mt-1">Quản trị: admin01 / admin123</p>
          </div>
        </div>
      </section>
    </main>
  );
}
