import { Card } from './Card';
export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card>
      <h2 className="text-sm font-medium text-muted">{label}</h2>
      <p className="mt-3 text-2xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </Card>
  );
}
