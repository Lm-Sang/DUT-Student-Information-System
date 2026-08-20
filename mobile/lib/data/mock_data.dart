import '../models/models.dart';

const studentProfile = StudentProfile(
  studentId: 'DUT2022001',
  fullName: 'Nguyen Van A',
  className: '22TCLC_DT1',
  major: 'Information Technology',
  academicYear: '2022 - 2026',
  gpa: 3.46,
  status: 'Good Standing',
);

const users = {
  'student01': {'password': 'student123', 'role': 'student', 'name': 'Nguyen Van A'},
  'admin01': {'password': 'admin123', 'role': 'admin', 'name': 'Tran Thi B'},
};

const courses = [
  Course(id: 'c1', code: 'IT101', name: 'Introduction to Programming', credits: 3),
  Course(id: 'c2', code: 'IT205', name: 'Database Systems', credits: 3),
  Course(id: 'c3', code: 'IT301', name: 'Web Development', credits: 4),
];

const grades = [
  Grade(course: 'IT101', score: 8.7, letter: 'A'),
  Grade(course: 'IT205', score: 7.9, letter: 'B+'),
  Grade(course: 'IT301', score: 8.4, letter: 'A'),
];

const classSchedule = [
  ScheduleItem(title: 'IT101', time: 'Mon 07:30 - 09:30', room: 'A1-203'),
  ScheduleItem(title: 'IT205', time: 'Wed 13:00 - 15:00', room: 'B3-101'),
];

const examSchedule = [
  ScheduleItem(title: 'Database Systems Final', time: '2026-12-20 09:00', room: 'Hall C'),
];

const tuitionRecords = [
  TuitionRecord(semester: 'Semester 1 - 2026', amount: 9500000, status: 'Paid'),
  TuitionRecord(semester: 'Semester 2 - 2026', amount: 9800000, status: 'Pending'),
];

const notifications = [
  NotificationItem(title: 'University opening ceremony', content: 'Main hall on Sept 05.'),
  NotificationItem(title: 'Course registration deadline', content: 'Complete registration before Aug 30.'),
];
