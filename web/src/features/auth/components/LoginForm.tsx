import { Button } from '@/shared/ui/Button';
import { useLoginForm } from '../hooks/useLoginForm';
export function LoginForm() {
  const form = useLoginForm();
  return (
    <form onSubmit={form.onSubmit} noValidate className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="username" className="block font-medium">
          Tên đăng nhập
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          spellCheck={false}
          autoCapitalize="none"
          className="w-full"
          value={form.username}
          onChange={(e) => form.setUsername(e.target.value)}
          aria-invalid={form.submitted && !!form.usernameError}
          aria-describedby="username-error"
        />
        <p id="username-error" className="text-xs text-danger">
          {form.submitted && form.usernameError}
        </p>
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="block font-medium">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="w-full"
          value={form.password}
          onChange={(e) => form.setPassword(e.target.value)}
          aria-invalid={form.submitted && !!form.passwordError}
          aria-describedby="password-error"
        />
        <p id="password-error" className="text-xs text-danger">
          {form.submitted && form.passwordError}
        </p>
      </div>
      {form.error && (
        <p role="alert" className="text-danger">
          {form.error}
        </p>
      )}
      <Button type="submit" disabled={form.loading} className="w-full">
        {form.loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
      </Button>
    </form>
  );
}
