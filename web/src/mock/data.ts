import type {
  AdminSummary,
  Course,
  Grade,
  NotificationItem,
  ScheduleItem,
  StudentProfile,
  TuitionPayment,
  User,
} from '../types';

export const users: Array<User & { password: string }> = [
  {
    id: 'u-student-1',
    username: 'student01',
    password: 'student123',
    fullName: 'Nguyen Van A',
    role: 'student',
  },
  {
    id: 'u-admin-1',
    username: 'admin01',
    password: 'admin123',
    fullName: 'Tran Thi B',
    role: 'admin',
  },
];

export const studentProfile: StudentProfile = {
  studentId: 'DUT2022001',
  fullName: 'Nguyen Van A',
  className: '22TCLC_DT1',
  major: 'Information Technology',
  academicYear: '2022 - 2026',
  gpa: 3.46,
  academicStatus: 'Good Standing',
};

export const courses: Course[] = [
  {
    id: 'c1',
    code: 'IT101',
    name: 'Introduction to Programming',
    credits: 3,
    instructor: 'Dr. Le Minh',
    description: 'Core programming concepts using modern software development practices.',
  },
  {
    id: 'c2',
    code: 'IT205',
    name: 'Database Systems',
    credits: 3,
    instructor: 'Dr. Pham Thu',
    description: 'Relational database design, SQL querying and transaction concepts.',
  },
  {
    id: 'c3',
    code: 'IT301',
    name: 'Web Development',
    credits: 4,
    instructor: 'Ms. Hoang Anh',
    description: 'Frontend and backend fundamentals for modern web applications.',
  },
];

export const registeredCourseIds = ['c1', 'c2'];

export const grades: Grade[] = [
  { courseCode: 'IT101', courseName: 'Introduction to Programming', score: 8.7, letter: 'A' },
  { courseCode: 'IT205', courseName: 'Database Systems', score: 7.9, letter: 'B+' },
  { courseCode: 'IT301', courseName: 'Web Development', score: 8.4, letter: 'A' },
];

export const schedules: ScheduleItem[] = [
  { id: 's1', title: 'IT101', day: 'Monday', time: '07:30 - 09:30', room: 'A1-203', type: 'class' },
  { id: 's2', title: 'IT205', day: 'Wednesday', time: '13:00 - 15:00', room: 'B3-101', type: 'class' },
  { id: 's3', title: 'IT301', day: 'Friday', time: '09:30 - 11:30', room: 'E2-402', type: 'class' },
  { id: 'e1', title: 'Database Systems Final', day: '2026-12-20', time: '09:00 - 11:00', room: 'Hall C', type: 'exam' },
];

export const tuitionPayments: TuitionPayment[] = [
  { id: 't1', semester: 'Semester 1 - 2026', amount: 9500000, status: 'Paid', paidAt: '2026-03-10' },
  { id: 't2', semester: 'Semester 2 - 2026', amount: 9800000, status: 'Pending' },
];

export const notifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'University opening ceremony',
    content: 'Opening ceremony will be held at the main hall on Sept 05.',
    date: '2026-08-01',
    category: 'announcement',
  },
  {
    id: 'n2',
    title: 'Course registration deadline',
    content: 'Students must complete registration before Aug 30.',
    date: '2026-08-15',
    category: 'academic',
  },
];

export const adminSummary: AdminSummary = {
  students: 12480,
  courses: 426,
  classes: 312,
  announcements: 18,
};
