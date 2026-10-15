import type { ReactNode } from 'react';
export function PageHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="page-title font-semibold">{title}</h1>
        {description && <p className="mt-2 text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
