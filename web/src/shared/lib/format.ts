const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
const date = new Intl.DateTimeFormat('vi-VN');
export const formatVnd = (value: number) => currency.format(value);
export function formatDate(value?: string) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : date.format(parsed);
}
