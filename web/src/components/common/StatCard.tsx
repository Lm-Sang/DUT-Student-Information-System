interface StatCardProps {
  label: string;
  value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <article className="card stat-card">
      <h3>{label}</h3>
      <p>{value}</p>
    </article>
  );
}
