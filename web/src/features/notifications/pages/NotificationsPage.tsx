import { useNotifications } from '../hooks/useNotifications';
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/FeedbackStates';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { PageHeading } from '@/shared/ui/PageHeading';
import { formatDate } from '@/shared/lib/format';
export function NotificationsPage() {
  const { data, loading, error, reload } = useNotifications();
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data?.length) return <EmptyState message="Chưa có thông báo." />;
  return (
    <div className="space-y-6">
      <PageHeading title="Thông báo" description="Thông tin đào tạo và thông báo từ nhà trường." />
      <div className="grid gap-6 md:grid-cols-2">
        {data.map((item) => (
          <Card key={item.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge>{item.category === 'academic' ? 'Học tập' : 'Thông báo chung'}</Badge>
              <time className="text-xs text-muted" dateTime={item.date}>
                {formatDate(item.date)}
              </time>
            </div>
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-muted">{item.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
