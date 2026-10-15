import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { paths } from '@/shared/config/routes';
import { Card } from '@/shared/ui/Card';
import { PageHeading } from '@/shared/ui/PageHeading';

export function AcademicPageTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return <PageHeading title={title} description={subtitle} />;
}

export function AcademicMetric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="academic-metric">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="metric-value mt-2 leading-snug">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </Card>
  );
}

export function AcademicMetrics({ children }: { children: ReactNode }) {
  return <div className="academic-metrics grid sm:grid-cols-2 xl:grid-cols-4">{children}</div>;
}

export function AcademicTabs() {
  const tabs = [
    { label: 'Tổng quan toàn khóa', to: paths.grades },
    { label: 'Điểm học kỳ hiện tại', to: paths.gradesCurrent },
    { label: 'Học vụ', to: paths.gradesStanding },
    { label: 'Điểm PLO', to: paths.gradesPlo },
  ];
  return (
    <nav aria-label="Mục kết quả học tập" className="academic-tabs">
      {tabs.map(({ label, to }) => (
        <NavLink key={to} to={to} end>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export function AcademicPanel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <Card className={`!border-line !p-5 ${className}`}>{children}</Card>;
}

export function AcademicTable({
  label,
  children,
  minWidth = 760,
}: {
  label: string;
  children: ReactNode;
  minWidth?: number;
}) {
  return (
    <div role="region" aria-label={label} tabIndex={0} className="max-w-full overflow-x-auto">
      <table className="academic-table" style={{ minWidth }}>
        <caption className="sr-only">{label}</caption>
        {children}
      </table>
    </div>
  );
}

export function AcademicSectionHeading({
  children,
  detail,
}: {
  children: ReactNode;
  detail?: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-[1.0625rem] font-semibold text-ink">{children}</h2>
      {detail && <span className="text-xs text-muted">{detail}</span>}
    </div>
  );
}
