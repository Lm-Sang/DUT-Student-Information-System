import { Button } from './Button';
export function LoadingState() {
  return (
    <p role="status" className="rounded-xl border border-line bg-surface p-6 text-muted">
      Đang tải dữ liệu…
    </p>
  );
}
export function ErrorState({
  message = 'Không thể tải dữ liệu.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="space-y-3 rounded-xl border border-danger/20 bg-danger-soft p-6 text-danger"
    >
      <p>{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Thử lại
        </Button>
      )}
    </div>
  );
}
export function EmptyState({ message = 'Chưa có dữ liệu.' }: { message?: string }) {
  return (
    <p className="rounded-lg border border-dashed border-line p-6 text-center text-muted">
      {message}
    </p>
  );
}
