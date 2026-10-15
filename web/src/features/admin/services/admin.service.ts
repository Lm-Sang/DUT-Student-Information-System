import { mockRequest } from '@/shared/lib/api/mockRequest';
import { adminSummary } from '../mocks/admin.mock';
import type { AdminSummary } from '../types';
export const adminService = {
  getSummary: (signal?: AbortSignal): Promise<AdminSummary> => mockRequest(adminSummary, signal),
  getManagementModules: (signal?: AbortSignal): Promise<string[]> =>
    mockRequest(
      [
        'Quản lý sinh viên',
        'Quản lý học phần',
        'Quản lý lớp học',
        'Quản lý điểm',
        'Quản lý lịch học',
        'Quản lý học phí',
        'Quản lý thông báo',
      ],
      signal,
    ),
};
