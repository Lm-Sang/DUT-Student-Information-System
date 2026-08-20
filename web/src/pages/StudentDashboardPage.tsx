import { useAsyncData } from '../hooks/useAsyncData';
import { studentService } from '../services/studentService';
import { EmptyState, ErrorState, LoadingState } from '../components/common/FeedbackStates';
import { StatCard } from '../components/common/StatCard';

export function StudentDashboardPage() {
  const { data: profile, loading, error } = useAsyncData(studentService.getProfile);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!profile) return <EmptyState />;

  return (
    <section>
      <h1>Student Dashboard</h1>
      <div className="grid cols-3">
        <StatCard label="Student ID" value={profile.studentId} />
        <StatCard label="Current GPA" value={profile.gpa.toFixed(2)} />
        <StatCard label="Academic Status" value={profile.academicStatus} />
      </div>
      <article className="card">
        <h2>Profile</h2>
        <ul>
          <li>Full name: {profile.fullName}</li>
          <li>Class: {profile.className}</li>
          <li>Major: {profile.major}</li>
          <li>Academic year: {profile.academicYear}</li>
        </ul>
      </article>
    </section>
  );
}
