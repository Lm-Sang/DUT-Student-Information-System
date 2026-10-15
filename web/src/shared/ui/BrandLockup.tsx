import { Link } from 'react-router-dom';
import logo from '@/shared/assets/dut-logo.png';

interface BrandLockupProps {
  to: string;
  compact?: boolean;
  inverse?: boolean;
}

export function BrandLockup({ to, compact = false, inverse = false }: BrandLockupProps) {
  return (
    <Link
      to={to}
      aria-label="Trường Đại học Bách khoa – Hệ thống thông tin sinh viên"
      className="group inline-flex min-w-0 items-center gap-3"
    >
      {compact ? (
        <span aria-hidden="true" className="w-[42px] shrink-0" />
      ) : (
        <img src={logo} width="40" height="40" alt="" className="shrink-0 object-contain" />
      )}
      <span className="min-w-0 leading-tight">
        <span
          className={`block truncate font-bold uppercase tracking-[0.04em] ${
            compact ? 'text-xs sm:text-xs' : 'text-xs'
          } ${inverse ? 'text-white' : 'text-brand'}`}
        >
          Trường Đại học Bách khoa
        </span>
        <span className={`mt-1 block truncate text-xs ${inverse ? 'text-white/75' : 'text-muted'}`}>
          Hệ thống thông tin sinh viên
        </span>
      </span>
    </Link>
  );
}
