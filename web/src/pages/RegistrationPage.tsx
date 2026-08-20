import { useMemo } from 'react';
import { EmptyState, ErrorState, LoadingState } from '../components/common/FeedbackStates';
import { useAsyncData } from '../hooks/useAsyncData';
import { calculateTotalCredits, studentService } from '../services/studentService';

export function RegistrationPage() {
  const courseState = useAsyncData(studentService.getCourses);
  const registrationState = useAsyncData(studentService.getRegisteredCourses);

  const registeredIds = useMemo(
    () => new Set((registrationState.data ?? []).map((course) => course.id)),
    [registrationState.data],
  );

  if (courseState.loading || registrationState.loading) return <LoadingState />;
  if (courseState.error) return <ErrorState message={courseState.error} />;
  if (registrationState.error) return <ErrorState message={registrationState.error} />;

  if (!courseState.data?.length) {
    return <EmptyState message="No available courses for registration." />;
  }

  return (
    <section>
      <h1>Course Registration</h1>
      <div className="grid cols-2">
        <article className="card">
          <h2>Available courses</h2>
          <ul>
            {courseState.data.map((course) => (
              <li key={course.id} className="row-between">
                <span>
                  {course.code} - {course.name} ({course.credits} credits)
                </span>
                <button
                  type="button"
                  disabled={registeredIds.has(course.id)}
                  onClick={async () => {
                    await studentService.registerCourse(course.id);
                    await registrationState.reload();
                  }}
                >
                  Register
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Registered courses</h2>
          {registrationState.data?.length ? (
            <>
              <ul>
                {registrationState.data.map((course) => (
                  <li key={course.id} className="row-between">
                    <span>
                      {course.code} - {course.name}
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        await studentService.removeRegisteredCourse(course.id);
                        await registrationState.reload();
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <p>Total credits: {calculateTotalCredits(registrationState.data)}</p>
            </>
          ) : (
            <EmptyState message="No registered courses yet." />
          )}
        </article>
      </div>
    </section>
  );
}
