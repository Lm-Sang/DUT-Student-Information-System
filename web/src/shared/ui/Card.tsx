import type { HTMLAttributes } from 'react';
export function Card({ className = '', ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={`ds-card min-w-0 rounded-xl border border-line bg-surface p-5 sm:p-6 ${className}`}
      {...props}
    />
  );
}
