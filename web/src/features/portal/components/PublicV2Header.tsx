import { Link } from 'react-router-dom';
import { paths } from '@/shared/config/routes';
import { VersionLink } from '@/shared/ui/VersionLink';

export function PublicV2Header() {
  return (
    <header className="v2-public-header">
      <div className="page-shell">
        <Link to={paths.home} className="v2-public-brand">
          <strong>DUT</strong>
          <span>
            Đại học Bách khoa<small>Đại học Đà Nẵng</small>
          </span>
        </Link>
        <nav aria-label="Điều hướng cổng thông tin">
          {[
            ['Trang chủ', '#trang-chu'],
            ['Chương trình', '#dich-vu'],
            ['Kế hoạch', '#thong-bao'],
            ['Danh sách', '#thong-bao'],
            ['Tra cứu', '#tra-cuu'],
            ['Học phí', paths.tuition],
            ['Hỗ trợ', '#ho-tro'],
            ['Dịch vụ', paths.serviceRequests],
          ].map(([label, to]) =>
            to.startsWith('#') ? (
              <a key={label} href={to}>
                {label}
              </a>
            ) : (
              <Link key={label} to={to}>
                {label}
              </Link>
            ),
          )}
        </nav>
        <div className="v2-public-header-actions">
          <VersionLink />
          <Link to={paths.login} className="v2-button">
            Đăng nhập
          </Link>
        </div>
      </div>
    </header>
  );
}
