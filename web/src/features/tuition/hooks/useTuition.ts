import { useState } from 'react';
import { useAsyncData } from '@/shared/hooks/useAsyncData';
import { tuitionService } from '../services/tuition.service';
import type { TuitionPayment } from '../types';
export function useTuition() {
  const state = useAsyncData(tuitionService.getPayments);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<TuitionPayment['status'] | 'all'>('all');
  const payments = (state.data ?? []).filter(
    (item) =>
      (status === 'all' || item.status === status) &&
      [item.semester, item.id, item.invoice ?? ''].some((value) =>
        value.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi')),
      ),
  );
  const outstanding = (state.data ?? [])
    .filter((item) => item.status !== 'Paid')
    .reduce((sum, item) => sum + item.amount, 0);
  return { ...state, payments, query, setQuery, status, setStatus, outstanding };
}
