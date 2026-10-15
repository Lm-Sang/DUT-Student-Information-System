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

export interface CurrentCourse {
  code: string;
  classCode: string;
  classGroup: string;
  name: string;
  credits: number;
  lecturer: string;
  day: string;
  periods: string;
  time?: string;
  room: string;
  weeks: string;
  kind?: 'project' | 'internship';
  formula?: string;
  examGroup?: string;
}
