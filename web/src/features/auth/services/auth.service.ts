import { users } from '../mocks/auth.mock';
import type { User } from '../types';
import { mockRequest } from '@/shared/lib/api/mockRequest';

export const authService = {
  async login(username: string, password: string): Promise<User> {
    const match = users.find((user) => user.username === username && user.password === password);
    if (!match) throw new Error('Tên đăng nhập hoặc mật khẩu không đúng.');
    return mockRequest({
      id: match.id,
      username: match.username,
      fullName: match.fullName,
      role: match.role,
      studentId: match.studentId,
      className: match.className,
    });
  },
};
