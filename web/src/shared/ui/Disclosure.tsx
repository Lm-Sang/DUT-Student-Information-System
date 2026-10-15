import { useId, useState, type ReactNode } from 'react';
import { Icon } from './Icon';

export function Disclosure({
  title,
  meta,
  children,
  defaultOpen = false,
  flush = false,
}: {
  title: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  flush?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <section className="disclosure">
      <h2>
        <button
          type="button"
          className="disclosure-trigger"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}
        >
          <span className="min-w-0 flex-1">{title}</span>
          {meta && <span className="disclosure-meta">{meta}</span>}
          <Icon name="chevron" className={`disclosure-chevron ${open ? 'is-expanded' : ''}`} />
        </button>
      </h2>
      <div
        id={id}
        hidden={!open}
        className={`disclosure-content ${flush ? 'disclosure-content--flush' : ''}`}
      >
        {children}
      </div>
    </section>
  );
}
