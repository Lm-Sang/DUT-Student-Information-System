import { EmptyState, ErrorState, LoadingState } from '../components/common/FeedbackStates';
import { useAsyncData } from '../hooks/useAsyncData';
import { studentService } from '../services/studentService';

export function NotificationsPage() {
  const { data, loading, error } = useAsyncData(studentService.getNotifications);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data?.length) return <EmptyState message="No notifications at this time." />;

  return (
    <section>
      <h1>Notifications</h1>
      <div className="grid cols-2">
        {data.map((item) => (
          <article className="card" key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.content}</p>
            <small>
              {item.category} • {item.date}
            </small>
          </article>
        ))}
      </div>
    </section>
  );
}
