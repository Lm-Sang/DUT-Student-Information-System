import { academicsService } from '@/features/academics';
import type { Course } from '@/features/academics';
import { mockRequest } from '@/shared/lib/api/mockRequest';
import { registeredCourseIds } from '../mocks/registration.mock';
const registrationState = new Set(registeredCourseIds);
export const registrationService = {
  async getRegisteredCourses(signal?: AbortSignal): Promise<Course[]> {
    const courses = await academicsService.getCourses(signal);
    return courses.filter((course) => registrationState.has(course.id));
  },
  async registerCourse(courseId: string): Promise<void> {
    const course = await academicsService.getCourse(courseId);
    if (!course) throw new Error('Học phần không tồn tại.');
    registrationState.add(courseId);
  },
  async removeCourse(courseId: string): Promise<void> {
    await mockRequest(undefined);
    registrationState.delete(courseId);
  },
};
