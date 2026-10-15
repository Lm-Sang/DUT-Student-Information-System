import { useAsyncData } from '@/shared/hooks/useAsyncData';
import { notificationsService } from '../services/notifications.service';
export const useNotifications = () => useAsyncData(notificationsService.getNotifications);
