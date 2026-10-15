import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { paths } from '@/shared/config/routes';

const labels: [string, string][] = [
  [paths.gradesCurrent, 'Điểm học kỳ hiện tại'],
  [paths.gradesStanding, 'Học vụ'],
  [paths.gradesPlo, 'Điểm PLO'],
  [paths.courses, 'Chương trình đào tạo'],
  [paths.grades, 'Kết quả học tập'],
  [paths.schedule, 'Lịch học & lịch thi'],
  [paths.thesis, 'Đồ án & tốt nghiệp'],
  [paths.registration, 'Đăng ký học phần'],
  [paths.tuition, 'Học phí'],
  [paths.conductSelf, 'Tự đánh giá rèn luyện'],
  [paths.conductClass, 'Đánh giá của lớp'],
  [paths.communityResults, 'Kết quả cộng đồng'],
  [paths.communityActivities, 'Hoạt động cộng đồng'],
  [paths.serviceRequests, 'Dịch vụ sinh viên'],
  [paths.profile, 'Hồ sơ sinh viên'],
  [paths.notifications, 'Thông báo'],
  [paths.adminRequests, 'Điều phối hồ sơ'],
  [paths.staffRequests, 'Hồ sơ được phân công'],
  [paths.admin, 'Quản trị hệ thống'],
];
export function Breadcrumbs() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const home =
    user?.role === 'admin'
      ? paths.admin
      : user?.role === 'staff'
        ? paths.staffRequests
        : paths.dashboard;
  const match = labels.find(([route]) => pathname === route || pathname.startsWith(route + '/'));
  const detail = match && pathname !== match[0];
  return (
    <nav aria-label="Đường dẫn trang" className="portal-breadcrumbs">
      <ol>
        <li>
          <Link to={home}>DUT Portal</Link>
        </li>
        {pathname !== home && match && (
          <li>
            {detail ? (
              <Link to={match[0]}>{match[1]}</Link>
            ) : (
              <span aria-current="page">{match[1]}</span>
            )}
          </li>
        )}
        {detail && (
          <li>
            <span aria-current="page">Chi tiết</span>
          </li>
        )}
      </ol>
    </nav>
  );
}
