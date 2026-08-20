import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { CoursesPage } from './pages/CoursesPage';
import { GradesPage } from './pages/GradesPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { SchedulePage } from './pages/SchedulePage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { TuitionPage } from './pages/TuitionPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/academic/courses"
          element={
            <ProtectedRoute role="student">
              <CoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/academic/courses/:id"
          element={
            <ProtectedRoute role="student">
              <CourseDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/academic/grades"
          element={
            <ProtectedRoute role="student">
              <GradesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/academic/schedule"
          element={
            <ProtectedRoute role="student">
              <SchedulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registration"
          element={
            <ProtectedRoute role="student">
              <RegistrationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tuition"
          element={
            <ProtectedRoute role="student">
              <TuitionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute role="student">
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
