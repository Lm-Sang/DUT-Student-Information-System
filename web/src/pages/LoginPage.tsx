import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const usernameError = useMemo(() => {
    if (!username) {
      return 'Username is required.';
    }
    return null;
  }, [username]);

  const passwordError = useMemo(() => {
    if (!password) {
      return 'Password is required.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    return null;
  }, [password]);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, navigate]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (usernameError || passwordError) {
      return;
    }

    try {
      setError(null);
      await login(username.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to login.');
    }
  };

  return (
    <section className="auth-wrapper">
      <form className="card auth-card" onSubmit={onSubmit}>
        <h1>University Portal Login</h1>
        <p>Student: student01/student123 - Admin: admin01/admin123</p>

        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
          {username && usernameError ? <small className="input-error">{usernameError}</small> : null}
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          {password && passwordError ? <small className="input-error">{passwordError}</small> : null}
        </label>

        {error ? <p className="input-error">{error}</p> : null}

        <button type="submit" disabled={loading || Boolean(usernameError) || Boolean(passwordError)}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </section>
  );
}
