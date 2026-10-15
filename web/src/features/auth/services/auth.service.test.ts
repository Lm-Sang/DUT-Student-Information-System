import { expect, it } from 'vitest';
import { demoStaffAccounts, demoStudentAccounts } from '@/shared/config/demoAccounts';
import { authService } from './auth.service';

it('authenticates all demo specialists and students with identities used by assignment and tracking', async () => {
  const accounts = [...demoStaffAccounts, ...demoStudentAccounts];
  expect(new Set(accounts.map((a) => a.id)).size).toBe(28);
  expect(new Set(accounts.map((a) => a.username)).size).toBe(28);
  const results = await Promise.all(
    accounts.map(async (account) => {
      const user = await authService.login(
        account.username,
        account.role === 'staff' ? 'staff123' : 'student123',
      );
      expect(user).toMatchObject({
        id: account.id,
        username: account.username,
        role: account.role,
      });
      expect(user).not.toHaveProperty('password');
      return user;
    }),
  );
  expect(results).toHaveLength(28);
  await expect(authService.login('staff16', 'wrong')).rejects.toThrow('không đúng');
});
