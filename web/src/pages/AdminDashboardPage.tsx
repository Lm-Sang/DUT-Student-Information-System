import { EmptyState, ErrorState, LoadingState } from '../components/common/FeedbackStates';
import { StatCard } from '../components/common/StatCard';
import { useAsyncData } from '../hooks/useAsyncData';
import { studentService } from '../services/studentService';

export function AdminDashboardPage() {
  const summaryState = useAsyncData(studentService.getAdminSummary);
  const managementState = useAsyncData(studentService.getAdminManagementLists);

  if (summaryState.loading || managementState.loading) return <LoadingState />;
  if (summaryState.error) return <ErrorState message={summaryState.error} />;
  if (managementState.error) return <ErrorState message={managementState.error} />;
  if (!summaryState.data) return <EmptyState message="No admin data available." />;

  return (
    <section>
      <h1>Admin Dashboard</h1>
      <div className="grid cols-4">
        <StatCard label="Students" value={summaryState.data.students} />
        <StatCard label="Courses" value={summaryState.data.courses} />
        <StatCard label="Classes" value={summaryState.data.classes} />
        <StatCard label="Announcements" value={summaryState.data.announcements} />
      </div>

      <article className="card">
        <h2>Management modules</h2>
        <ul>
          {managementState.data?.map((module) => <li key={module}>{module}</li>)}
        </ul>
      </article>
    </section>
  );
}
