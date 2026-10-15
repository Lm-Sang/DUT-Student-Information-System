import { Link } from 'react-router-dom';
import { useStudentProfile } from '../hooks/useStudentProfile';
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/FeedbackStates';
import { Card } from '@/shared/ui/Card';
import { Disclosure } from '@/shared/ui/Disclosure';
import { Icon, type IconName } from '@/shared/ui/Icon';
import { paths } from '@/shared/config/routes';
import { todayClasses } from '../data/dashboard.data';
const quickActions: { label: string; to: string; icon: IconName }[] = [
  { label: 'Bảng điểm', to: paths.gradesCurrent, icon: 'chart' },
  { label: 'Lịch học & thi', to: paths.schedule, icon: 'calendar' },
  { label: 'Học phần', to: paths.courses, icon: 'book' },
  { label: 'Dịch vụ', to: paths.serviceRequests, icon: 'file' },
];

export function StudentDashboardPage() {
  const { data: profile, loading, error, reload } = useStudentProfile();
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!profile) return <EmptyState />;
  return (
    <div>
      <div className="dashboard-greeting">
        <div>
          <h1>Chào {profile.fullName}!</h1>
          <p>{profile.className} · Học kỳ I, 2026–2027</p>
        </div>
        <div className="dashboard-date">
          <Icon name="calendar" />
          <span>
            Thứ Hai, 14/09/2026 <span className="text-muted">· Lịch mẫu</span>
          </span>
        </div>
      </div>
      <div className="dashboard-grid">
        <Card className="dashboard-schedule-panel">
          <div className="dashboard-schedule-head">
            <h2>Lịch học hôm nay</h2>
            <Link to={paths.schedule}>
              Xem cả tuần <Icon name="arrow" className="!size-4" />
            </Link>
          </div>
          <p className="mb-5 text-xs text-muted">Tuần 3 · Học kỳ 1 · 3 học phần</p>
          <ol>
            {todayClasses.map((item) => (
              <li key={item.time} className="today-lesson">
                <time dateTime={`2026-09-14T${item.time}`}>
                  {item.time}
                  <small>{item.periods}</small>
                </time>
                <div>
                  <h3>{item.title}</h3>
                  <div className="today-lesson-meta">
                    <span>
                      <Icon name="pin" className="!size-4" />
                      {item.room}
                    </span>
                    <span>
                      <Icon name="users" className="!size-4" />
                      {item.lecturer}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Card>
        <Card className="dashboard-news-panel">
          <div className="dashboard-schedule-head">
            <h2>Thông báo mới</h2>
            <Link to={paths.notifications}>Tất cả</Link>
          </div>
          <Link to={paths.notifications} className="block border-t border-line py-5">
            <div className="mb-3 flex justify-between text-xs text-muted">
              <span>Khoa CNTT</span>
              <time dateTime="2026-09-12">12/09</time>
            </div>
            <h3 className="font-medium leading-6">
              Kế hoạch bảo vệ Đồ án tốt nghiệp & PBL 6 đầu kỳ 1
            </h3>
          </Link>
          <Link to={paths.notifications} className="block border-t border-line pt-5">
            <div className="mb-3 flex justify-between text-xs text-muted">
              <span>Khảo thí</span>
              <time dateTime="2026-09-08">08/09</time>
            </div>
            <h3 className="font-medium leading-6">
              Đăng ký thi chuẩn đầu ra Tiếng Anh VSTEP đợt 10/2026
            </h3>
            <p className="mt-2 text-xs text-muted">Hạn chót trực tuyến: 28/09</p>
          </Link>
        </Card>
        <div className="dashboard-requirements-panel">
          {' '}
          <Disclosure title="Chuẩn đầu ra & rèn luyện">
            <div className="dashboard-standards">
              {[
                ['Ngoại ngữ B2 (VSTEP)', 'Đã duyệt'],
                ['Chứng chỉ Tin học', 'Đã đạt chuẩn'],
                ['GDTC & GDQP–AN', 'Hoàn thành'],
              ].map(([label, value]) => (
                <div key={label} className="standard-row">
                  <p>{label}</p>
                  <span className="text-success">
                    <Icon name="check" className="mr-1 inline-block !size-4" />
                    {value}
                  </span>
                </div>
              ))}
              <div className="standard-row">
                <p>Đánh giá điểm rèn luyện</p>
                <span className="text-muted">Hạn trong dữ liệu mẫu: 25/09</span>
                <Link to={paths.conductSelf} className="mt-2 block text-xs font-medium text-brand">
                  Mở phiếu đánh giá
                </Link>
              </div>
            </div>
          </Disclosure>
        </div>
        <div className="dashboard-actions-panel space-y-6">
          <Card className="dashboard-quick-panel">
            <h2>Truy cập nhanh</h2>
            <div className="dashboard-shortcuts" aria-label="Truy cập nhanh">
              {quickActions.map((item) => (
                <Link key={item.to} to={item.to}>
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </Card>
          <a
            href="https://www.microsoft365.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-xl border border-line bg-surface px-5 py-4 text-sm font-medium"
          >
            <span>Microsoft 365 & OneDrive</span>
            <Icon name="external" className="!size-4 text-muted" />
          </a>
        </div>
      </div>
    </div>
  );
}
