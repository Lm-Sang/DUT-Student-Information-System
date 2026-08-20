import { EmptyState, ErrorState, LoadingState } from '../components/common/FeedbackStates';
import { useAsyncData } from '../hooks/useAsyncData';
import { studentService } from '../services/studentService';

export function SchedulePage() {
  const classState = useAsyncData(studentService.getSchedules);
  const examState = useAsyncData(studentService.getExamSchedules);

  if (classState.loading || examState.loading) return <LoadingState />;
  if (classState.error) return <ErrorState message={classState.error} />;
  if (examState.error) return <ErrorState message={examState.error} />;

  return (
    <section>
      <h1>Class & Exam Schedules</h1>
      <div className="grid cols-2">
        <article className="card">
          <h2>Class schedule</h2>
          {classState.data?.length ? (
            <ul>
              {classState.data.map((item) => (
                <li key={item.id}>
                  {item.day} - {item.time} - {item.title} ({item.room})
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="No class schedule available." />
          )}
        </article>

        <article className="card">
          <h2>Exam schedule</h2>
          {examState.data?.length ? (
            <ul>
              {examState.data.map((item) => (
                <li key={item.id}>
                  {item.day} - {item.time} - {item.title} ({item.room})
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="No exam schedule available." />
          )}
        </article>
      </div>
    </section>
  );
}
