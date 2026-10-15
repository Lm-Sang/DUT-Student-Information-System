import { lazy, Suspense, useLayoutEffect } from 'react';
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { LoginPage, ProtectedRoute } from '@/features/auth';
import {
  StudentDashboardPage,
  StudentDashboardV2Page,
  StudentProfilePage,
} from '@/features/student';
import { PublicHomePage } from '@/features/portal';
import {
  CoursesPage,
  CourseDetailPage,
  GradesPage,
  CurrentGradesPage,
  AcademicStandingPage,
  PloPage,
  SchedulePage,
  ThesisPage,
  ThesisDetailPage,
} from '@/features/academics';
import { RegistrationPage } from '@/features/registration';
import { TuitionPage } from '@/features/tuition';
import { SelfAssessmentPage, ClassAssessmentPage } from '@/features/conduct';
import { ActivitiesPage, ActivityDetailPage, CommunityResultsPage } from '@/features/community';
import { NotificationsPage } from '@/features/notifications';
import { AdminDashboardPage } from '@/features/admin';
import { paths } from '@/shared/config/routes';
import { PortalLayout } from '../layouts/PortalLayout';
import { LoadingState } from '@/shared/ui/FeedbackStates';
import { usePortalEdition } from '@/shared/config/portalEdition';
import { NotFoundPage } from '../pages/NotFoundPage';

const PortalV2Layout = lazy(() =>
  import('../layouts/PortalV2Layout').then((module) => ({ default: module.PortalV2Layout })),
);
const ServiceRequestsPage = lazy(() =>
  import('@/features/services').then((module) => ({ default: module.ServiceRequestsPage })),
);
const StaffRequestsPage = lazy(() =>
  import('@/features/services').then((module) => ({ default: module.StaffRequestsPage })),
);

function ScrollOnRouteChange() {
  const { pathname, hash, search } = useLocation();
  const view = new URLSearchParams(search).get('view');
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (!hash && navigationType !== 'POP') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash, view, navigationType]);

  return null;
}

export function AppRoutes() {
  const v2 = usePortalEdition() === 'v2';
  return (
    <>
      <ScrollOnRouteChange />
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route path={paths.home} element={<PublicHomePage />} />
          <Route path={paths.login} element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={v2 ? <PortalV2Layout /> : <PortalLayout />}>
              <Route element={<ProtectedRoute role="student" />}>
                <Route
                  path={paths.dashboard}
                  element={v2 ? <StudentDashboardV2Page /> : <StudentDashboardPage />}
                />
                <Route path={paths.profile} element={<StudentProfilePage />} />
                <Route path={paths.courses} element={<CoursesPage />} />
                <Route path={`${paths.courses}/:id`} element={<CourseDetailPage />} />
                <Route path={paths.grades} element={<GradesPage />} />
                <Route path={paths.gradesCurrent} element={<CurrentGradesPage />} />
                <Route path={paths.gradesStanding} element={<AcademicStandingPage />} />
                <Route path={paths.gradesPlo} element={<PloPage />} />
                <Route path={paths.schedule} element={<SchedulePage />} />
                <Route path={paths.thesis} element={<ThesisPage />} />
                <Route path={paths.thesisDetails} element={<ThesisDetailPage />} />
                <Route path={paths.registration} element={<RegistrationPage />} />
                <Route path={paths.tuition} element={<TuitionPage />} />
                <Route path={paths.serviceRequests} element={<ServiceRequestsPage />} />
                <Route path={paths.conductSelf} element={<SelfAssessmentPage />} />
                <Route path={paths.conductClass} element={<ClassAssessmentPage />} />
                <Route path={paths.communityResults} element={<CommunityResultsPage />} />
                <Route path={paths.communityActivities} element={<ActivitiesPage />} />
                <Route path={`${paths.communityActivities}/:id`} element={<ActivityDetailPage />} />
                <Route path={paths.notifications} element={<NotificationsPage />} />
              </Route>
              <Route element={<ProtectedRoute role="admin" />}>
                <Route path={paths.admin} element={<AdminDashboardPage />} />
                <Route path={paths.adminRequests} element={<StaffRequestsPage />} />
              </Route>
              <Route element={<ProtectedRoute role="staff" />}>
                <Route path={paths.staffRequests} element={<StaffRequestsPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}
