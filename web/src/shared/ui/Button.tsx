import type { ButtonHTMLAttributes } from 'react';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}
const variants = {
  primary: 'border-brand bg-action text-white hover:bg-brand-hover',
  secondary:
    'border-line bg-surface text-brand hover:border-brand/30 hover:bg-subtle hover:shadow-sm',
  ghost: 'border-transparent bg-transparent text-brand hover:bg-subtle hover:text-brand-deep',
};
export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      data-variant={variant}
      className={`ds-button inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
