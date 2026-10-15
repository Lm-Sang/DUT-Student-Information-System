import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from './useAuth';
export function useLoginForm() {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const usernameError = username.trim() ? null : 'Vui lòng nhập tên đăng nhập.';
  const passwordError = password.length >= 6 ? null : 'Mật khẩu phải có ít nhất 6 ký tự.';
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (loading) return;
    if (usernameError || passwordError) {
      const field = event.currentTarget.elements.namedItem(usernameError ? 'username' : 'password');
      if (field instanceof HTMLElement) field.focus();
      return;
    }
    setError(null);
    try {
      await login(username.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể đăng nhập.');
    }
  };
  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    submitted,
    usernameError,
    passwordError,
    onSubmit,
  };
}
