export type UserRole = 'student' | 'admin' | 'staff';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  studentId?: string;
  className?: string;
}
