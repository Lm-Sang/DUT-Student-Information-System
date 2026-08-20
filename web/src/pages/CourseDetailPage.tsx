import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingState } from '../components/common/FeedbackStates';
import { useAsyncData } from '../hooks/useAsyncData';
import { studentService } from '../services/studentService';

export function CourseDetailPage() {
  const { id = '' } = useParams();
  const fetcher = useMemo(() => () => studentService.getCourseById(id), [id]);
  const { data, loading, error } = useAsyncData(fetcher);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <EmptyState message="Course not found." />;

  return (
    <section className="card">
      <h1>
        {data.code} - {data.name}
      </h1>
      <p>Credits: {data.credits}</p>
      <p>Instructor: {data.instructor}</p>
      <p>{data.description}</p>
      <Link to="/academic/courses">Back to course list</Link>
    </section>
  );
}
