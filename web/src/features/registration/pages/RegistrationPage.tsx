import { useRegistration } from '../hooks/useRegistration';
import { RegistrationCourseList } from '../components/RegistrationCourseList';
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/FeedbackStates';
import { PageHeading } from '@/shared/ui/PageHeading';
import { Card } from '@/shared/ui/Card';
export function RegistrationPage() {
  const state = useRegistration();
  if (state.loading) return <LoadingState />;
  if (state.error) return <ErrorState message={state.error} onRetry={state.reload} />;
  if (!state.data?.courses.length) return <EmptyState message="Chưa có học phần mở đăng ký." />;
  return (
    <div className="space-y-6">
      <PageHeading
        title="Đăng ký học phần"
        description="Chọn học phần và kiểm tra tổng số tín chỉ đăng ký."
      />
      {state.mutationError && <ErrorState message={state.mutationError} />}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-lg font-semibold">Học phần mở đăng ký</h2>
          <RegistrationCourseList
            courses={state.data.courses}
            pending={state.pending}
            registeredIds={state.registeredIds}
            onAction={state.register}
            action="register"
          />
        </Card>
        <Card>
          <h2 className="mb-3 text-lg font-semibold">Học phần đã đăng ký</h2>
          {state.data.registered.length ? (
            <RegistrationCourseList
              courses={state.data.registered}
              pending={state.pending}
              onAction={state.remove}
              action="remove"
            />
          ) : (
            <EmptyState message="Bạn chưa đăng ký học phần nào." />
          )}
          <p className="mt-4 border-t border-line pt-4 font-semibold" role="status">
            Tổng số tín chỉ: {state.totalCredits}
          </p>
        </Card>
      </div>
    </div>
  );
}
