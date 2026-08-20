import { EmptyState, ErrorState, LoadingState } from '../components/common/FeedbackStates';
import { useAsyncData } from '../hooks/useAsyncData';
import { studentService } from '../services/studentService';

function formatVnd(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

export function TuitionPage() {
  const { data, loading, error } = useAsyncData(studentService.getTuition);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data?.length) return <EmptyState message="No tuition information available." />;

  const current = data[data.length - 1];

  return (
    <section>
      <h1>Tuition</h1>
      <article className="card">
        <h2>Current payment status</h2>
        <p>
          {current.semester}: <strong>{current.status}</strong> - {formatVnd(current.amount)}
        </p>
      </article>
      <article className="card">
        <h2>Payment history</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Semester</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Paid date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.semester}</td>
                <td>{formatVnd(item.amount)}</td>
                <td>{item.status}</td>
                <td>{item.paidAt ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
}
