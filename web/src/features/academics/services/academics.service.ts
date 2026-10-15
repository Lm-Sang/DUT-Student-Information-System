import { mockRequest } from '@/shared/lib/api/mockRequest';
import { courses, grades, schedules } from '../mocks/academics.mock';
import { academicPortalMock } from '../mocks/academicPortal.mock';
import type { Course, Grade, ScheduleItem } from '../types';
export const academicsService = {
  getCourses: (signal?: AbortSignal): Promise<Course[]> => mockRequest(courses, signal),
  getCourse: (id: string, signal?: AbortSignal): Promise<Course | undefined> =>
    mockRequest(
      courses.find((course) => course.id === id),
      signal,
    ),
  getGrades: (signal?: AbortSignal): Promise<Grade[]> => mockRequest(grades, signal),
  getSchedule: (signal?: AbortSignal): Promise<ScheduleItem[]> => mockRequest(schedules, signal),
  getPortalData: (signal?: AbortSignal) => mockRequest(academicPortalMock, signal),
};
