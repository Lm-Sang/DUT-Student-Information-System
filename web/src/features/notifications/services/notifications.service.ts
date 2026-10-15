import { mockRequest } from '@/shared/lib/api/mockRequest';
import { notifications } from '../mocks/notifications.mock';
import type { NotificationItem } from '../types';
export const notificationsService = {
  getNotifications: (signal?: AbortSignal): Promise<NotificationItem[]> =>
    mockRequest(notifications, signal),
};
