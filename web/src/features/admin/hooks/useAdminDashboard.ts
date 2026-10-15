import { useAsyncData } from '@/shared/hooks/useAsyncData';
import { adminService } from '../services/admin.service';
async function getDashboard(signal: AbortSignal) {
  const [summary, modules] = await Promise.all([
    adminService.getSummary(signal),
    adminService.getManagementModules(signal),
  ]);
  return { summary, modules };
}
export const useAdminDashboard = () => useAsyncData(getDashboard);
