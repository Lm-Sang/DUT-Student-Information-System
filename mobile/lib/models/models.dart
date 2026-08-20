class StudentProfile {
  final String studentId;
  final String fullName;
  final String className;
  final String major;
  final String academicYear;
  final double gpa;
  final String status;

  const StudentProfile({
    required this.studentId,
    required this.fullName,
    required this.className,
    required this.major,
    required this.academicYear,
    required this.gpa,
    required this.status,
  });
}

class Course {
  final String id;
  final String code;
  final String name;
  final int credits;

  const Course({required this.id, required this.code, required this.name, required this.credits});
}

class Grade {
  final String course;
  final double score;
  final String letter;

  const Grade({required this.course, required this.score, required this.letter});
}

class ScheduleItem {
  final String title;
  final String time;
  final String room;

  const ScheduleItem({required this.title, required this.time, required this.room});
}

class TuitionRecord {
  final String semester;
  final int amount;
  final String status;

  const TuitionRecord({required this.semester, required this.amount, required this.status});
}

class NotificationItem {
  final String title;
  final String content;

  const NotificationItem({required this.title, required this.content});
}
