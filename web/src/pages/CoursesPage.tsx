import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingState } from '../components/common/FeedbackStates';
import { useAsyncData } from '../hooks/useAsyncData';
import { studentService } from '../services/studentService';

export function CoursesPage() {
  const { data, loading, error } = useAsyncData(studentService.getCourses);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data?.length) return <EmptyState message="No courses available." />;

  return (
    <section>
      <h1>Course List</h1>
      <div className="grid cols-2">
        {data.map((course) => (
          <article className="card" key={course.id}>
            <h2>
              {course.code} - {course.name}
            </h2>
            <p>Credits: {course.credits}</p>
            <p>Instructor: {course.instructor}</p>
            <Link to={`/academic/courses/${course.id}`}>View details</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
