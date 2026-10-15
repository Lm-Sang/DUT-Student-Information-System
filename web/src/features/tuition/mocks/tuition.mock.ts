import type { TuitionPayment } from '../types';

export const tuitionPayments: TuitionPayment[] = [
  {
    id: 'DUT-PAY-20260910-0982',
    semester: 'HK1 · 2026–2027',
    installment: 'Đợt 1',
    amount: 6480000,
    status: 'Paid',
    paidAt: '2026-09-10T09:42:15',
    method: 'VietinBank iPay',
    invoice: 'Đã xuất hóa đơn',
  },
  {
    id: 'DUT-PAY-20260218-0112',
    semester: 'HK2 · 2025–2026',
    installment: '100%',
    amount: 10800000,
    status: 'Paid',
    paidAt: '2026-02-18T14:10:00',
    method: 'Cổng VNPAY-QR',
    invoice: 'HD-098231',
  },
  {
    id: 'DUT-PAY-20250914-7721',
    semester: 'HK1 · 2025–2026',
    installment: '100%',
    amount: 13500000,
    status: 'Paid',
    paidAt: '2025-09-14T10:05:00',
    method: 'VietinBank Direct',
    invoice: 'HD-076122',
  },
];
