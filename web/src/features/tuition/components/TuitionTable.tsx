import type { ReactNode } from 'react';

export function TuitionTable({
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
