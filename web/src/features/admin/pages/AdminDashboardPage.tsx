import { Link } from 'react-router-dom';
import { paths } from '@/shared/config/routes';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/FeedbackStates';
import { StatCard } from '@/shared/ui/StatCard';
import { Card } from '@/shared/ui/Card';
import { PageHeading } from '@/shared/ui/PageHeading';
export function AdminDashboardPage() {
  const { data, loading, error, reload } = useAdminDashboard();
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return <EmptyState />;
  return (
    <div className="space-y-6">
      <PageHeading
        title="Tổng quan quản trị"
        description="Thông tin tổng hợp hệ thống sinh viên."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sinh viên" value={data.summary.students} />
        <StatCard label="Học phần" value={data.summary.courses} />
        <StatCard label="Lớp học" value={data.summary.classes} />
        <StatCard label="Thông báo" value={data.summary.announcements} />
      </div>
      <Card>
        <Link to={paths.adminRequests} className="text-lg font-semibold text-brand">
          Điều phối hồ sơ sinh viên
        </Link>
        <p className="mt-2 text-muted">Phân công chuyên viên, theo dõi tiến độ và hạn xử lý.</p>
      </Card>
      <Card>
        <h2 className="mb-4 text-lg font-semibold">Phân hệ quản lý</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {data.modules.map((module) => (
            <li key={module} className="rounded-lg bg-canvas px-4 py-3">
              {module}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
