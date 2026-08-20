export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
}

export interface StudentProfile {
  studentId: string;
  fullName: string;
  className: string;
  major: string;
  academicYear: string;
  gpa: number;
  academicStatus: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  instructor: string;
  description: string;
}

export interface Grade {
  courseCode: string;
  courseName: string;
  score: number;
  letter: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  day: string;
  time: string;
  room: string;
  type: 'class' | 'exam';
}

export interface TuitionPayment {
  id: string;
  semester: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'announcement' | 'academic';
}

export interface AdminSummary {
  students: number;
  courses: number;
  classes: number;
  announcements: number;
}
