import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="logo">
          DUT Student Information System
        </Link>
        <div className="header-actions">
          <span>{user?.fullName}</span>
          <button type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>
      <div className="content-shell">
        <nav className="sidebar">
          {user?.role === 'student' ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/academic/courses">Courses</NavLink>
              <NavLink to="/academic/grades">Grades</NavLink>
              <NavLink to="/academic/schedule">Schedule</NavLink>
              <NavLink to="/registration">Registration</NavLink>
              <NavLink to="/tuition">Tuition</NavLink>
              <NavLink to="/notifications">Notifications</NavLink>
            </>
          ) : (
            <NavLink to="/admin">Admin dashboard</NavLink>
          )}
        </nav>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
