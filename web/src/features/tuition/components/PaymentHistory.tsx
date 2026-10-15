import { Fragment, useState } from 'react';
import type { TuitionPayment } from '../types';
import { Badge } from '@/shared/ui/Badge';
import { TuitionTable } from './TuitionTable';

const money = (amount: number) => `${new Intl.NumberFormat('vi-VN').format(amount)} đ`;
function paymentTime(value?: string) {
  if (!value) return '—';
  const [date, time] = value.split('T');
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year} · ${time}`;
}

export function PaymentHistory({ payments }: { payments: TuitionPayment[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  if (!payments.length) {
    return (
      <p className="rounded-lg bg-subtle p-6 text-sm text-muted">
        Không tìm thấy khoản học phí phù hợp.
      </p>
    );
  }
  return (
    <TuitionTable label="Lịch sử thanh toán và hóa đơn" minWidth={850}>
      <thead>
        <tr>
          <th>Thời gian / học kỳ</th>
          <th>Giao dịch / phương thức</th>
          <th>Số tiền</th>
          <th>Trạng thái</th>
          <th>Hóa đơn</th>
          <th>Tác vụ</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((payment) => (
          <Fragment key={payment.id}>
            <tr>
              <td>
                <strong className="block whitespace-nowrap font-medium">
                  {paymentTime(payment.paidAt)}
                </strong>
                <span className="text-xs text-muted">
                  {payment.semester} · {payment.installment}
                </span>
              </td>
              <td>
                <strong className="block whitespace-nowrap font-medium text-brand-deep">
                  {payment.id}
                </strong>
                <span className="text-xs text-muted">{payment.method}</span>
              </td>
              <td className="whitespace-nowrap font-semibold">{money(payment.amount)}</td>
              <td>
                <Badge tone={payment.status === 'Paid' ? 'success' : 'warning'}>
                  {payment.status === 'Paid' ? 'Đã tất toán' : 'Chưa thanh toán'}
                </Badge>
              </td>
              <td className="whitespace-nowrap">{payment.invoice ?? '—'}</td>
              <td>
                <button
                  type="button"
                  aria-expanded={expanded === payment.id}
                  aria-controls={`payment-${payment.id}`}
                  className="whitespace-nowrap font-medium text-brand hover:underline"
                  onClick={() => setExpanded(expanded === payment.id ? null : payment.id)}
                >
                  {expanded === payment.id ? 'Thu gọn' : 'Xem chi tiết'}
                </button>
              </td>
            </tr>
            {expanded === payment.id && (
              <tr id={`payment-${payment.id}`}>
                <td colSpan={6} className="bg-canvas">
                  <dl className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <dt className="text-xs text-muted">Mã khoản thu</dt>
                      <dd className="mt-1 font-medium">{payment.id}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted">Phương thức thanh toán</dt>
                      <dd className="mt-1 font-medium">{payment.method}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted">Hóa đơn điện tử</dt>
                      <dd className="mt-1 font-medium">{payment.invoice}</dd>
                    </div>
                  </dl>
                </td>
              </tr>
            )}
          </Fragment>
        ))}
      </tbody>
    </TuitionTable>
  );
}
