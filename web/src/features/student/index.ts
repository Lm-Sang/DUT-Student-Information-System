export { StudentDashboardPage } from './pages/StudentDashboardPage';
import { lazy } from 'react';
export const StudentDashboardV2Page = lazy(() =>
  import('./pages/StudentDashboardV2Page').then((module) => ({
    default: module.StudentDashboardV2Page,
  })),
);
export { StudentProfilePage } from './pages/StudentProfilePage';
