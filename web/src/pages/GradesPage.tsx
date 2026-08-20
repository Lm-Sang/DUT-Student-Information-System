import { EmptyState, ErrorState, LoadingState } from '../components/common/FeedbackStates';
import { useAsyncData } from '../hooks/useAsyncData';
import { studentService } from '../services/studentService';

export function GradesPage() {
  const { data, loading, error } = useAsyncData(studentService.getGrades);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data?.length) return <EmptyState message="No grades available." />;

  const gpa = data.reduce((sum, item) => sum + item.score, 0) / data.length;

  return (
    <section>
      <h1>Grades & GPA</h1>
      <article className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Score</th>
              <th>Letter</th>
            </tr>
          </thead>
          <tbody>
            {data.map((grade) => (
              <tr key={grade.courseCode}>
                <td>{grade.courseName}</td>
                <td>{grade.score}</td>
                <td>{grade.letter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
      <p className="state-box">Estimated GPA: {(gpa / 2.5).toFixed(2)}</p>
    </section>
  );
}
