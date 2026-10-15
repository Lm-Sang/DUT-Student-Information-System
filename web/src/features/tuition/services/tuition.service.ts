import { mockRequest } from '@/shared/lib/api/mockRequest';
import { tuitionPayments } from '../mocks/tuition.mock';
import type { TuitionPayment } from '../types';
export const tuitionService = {
  getPayments: (signal?: AbortSignal): Promise<TuitionPayment[]> =>
    mockRequest(tuitionPayments, signal),
};
