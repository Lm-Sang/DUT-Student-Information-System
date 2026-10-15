import { Link, useSearchParams } from 'react-router-dom';

export function SectionNav({
  label,
  items,
  value,
}: {
  label: string;
  items: { value: string; label: string }[];
  value: string;
}) {
  const [params] = useSearchParams();
  return (
    <nav aria-label={label} className="section-nav">
      {items.map((item) => {
        const next = new URLSearchParams(params);
        next.set('view', item.value);
        return (
          <Link
            key={item.value}
            to={`?${next}`}
            aria-current={value === item.value ? 'page' : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
