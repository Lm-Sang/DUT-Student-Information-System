import { demoStaffAccounts, demoStudentAccounts } from '@/shared/config/demoAccounts';
import type { User } from '../types';

export const users: Array<User & { password: string }> = [
  ...demoStaffAccounts.map((person) => ({ ...person, password: 'staff123' })),
  ...demoStudentAccounts.map((person) => ({ ...person, password: 'student123' })),
  {
    id: 'u-admin-1',
    username: 'admin01',
    password: 'admin123',
    fullName: 'Trần Thị B',
    role: 'admin',
  },
];
