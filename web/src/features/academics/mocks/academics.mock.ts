import type { Course, Grade, ScheduleItem } from '../types';

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

export const grades: Grade[] = [
  { courseCode: 'IT101', courseName: 'Introduction to Programming', score: 8.7, letter: 'A' },
  { courseCode: 'IT205', courseName: 'Database Systems', score: 7.9, letter: 'B+' },
  { courseCode: 'IT301', courseName: 'Web Development', score: 8.4, letter: 'A' },
];

export const schedules: ScheduleItem[] = [
  { id: 's1', title: 'IT101', day: 'Monday', time: '07:30 - 09:30', room: 'A1-203', type: 'class' },
  {
    id: 's2',
    title: 'IT205',
    day: 'Wednesday',
    time: '13:00 - 15:00',
    room: 'B3-101',
    type: 'class',
  },
  { id: 's3', title: 'IT301', day: 'Friday', time: '09:30 - 11:30', room: 'E2-402', type: 'class' },
  {
    id: 'e1',
    title: 'Database Systems Final',
    day: '2026-12-20',
    time: '09:00 - 11:00',
    room: 'Hall C',
    type: 'exam',
  },
];
