import type { ReactNode } from 'react';
export function Table({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      className="max-w-full overflow-x-auto rounded-lg border border-line"
      role="region"
      aria-label={label}
      tabIndex={0}
    >
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <caption className="sr-only">{label}</caption>
        {children}
      </table>
    </div>
  );
}
